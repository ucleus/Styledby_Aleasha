<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::orderBy('lName', 'asc')->orderBy('fName', 'asc')->get();
        return response()->json($clients);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'fName' => 'required|string|max:255',
            'lName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'apt' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'zip' => 'required|string|max:10',
            'phone' => 'required|string|max:20',
            'phone2' => 'nullable|string|max:20',
            'email' => 'required|email|unique:clients,email',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'fName', 'lName', 'address', 'apt', 'city', 
            'state', 'zip', 'phone', 'phone2', 'email',
            'instagram', 'facebook', 'twitter', 'tiktok', 
            'linkedin', 'notes'
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $filename = time() . '_' . $photo->getClientOriginalName();
            $path = $photo->storeAs('client-photos', $filename, 'public');
            $data['photo_path'] = $path;
        }

        $client = Client::create($data);

        return response()->json([
            'message' => 'Client created successfully',
            'client' => $client
        ], 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'fName' => 'required|string|max:255',
            'lName' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'apt' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|size:2',
            'zip' => 'required|string|max:10',
            'phone' => 'required|string|max:20',
            'phone2' => 'nullable|string|max:20',
            'email' => 'required|email|unique:clients,email,' . $client->id,
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'fName', 'lName', 'address', 'apt', 'city', 
            'state', 'zip', 'phone', 'phone2', 'email',
            'instagram', 'facebook', 'twitter', 'tiktok', 
            'linkedin', 'notes'
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($client->photo_path) {
                Storage::disk('public')->delete($client->photo_path);
            }
            
            $photo = $request->file('photo');
            $filename = time() . '_' . $photo->getClientOriginalName();
            $path = $photo->storeAs('client-photos', $filename, 'public');
            $data['photo_path'] = $path;
        }

        $client->update($data);

        return response()->json([
            'message' => 'Client updated successfully',
            'client' => $client
        ]);
    }

    public function destroy(Client $client)
    {
        // Delete photo if exists
        if ($client->photo_path) {
            Storage::disk('public')->delete($client->photo_path);
        }

        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully'
        ]);
    }
}
