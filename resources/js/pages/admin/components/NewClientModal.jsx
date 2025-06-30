import React, { useState } from 'react';
import { X, Upload, User, Instagram, Facebook, Twitter, Linkedin, MessageSquare } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';

const NewClientModal = ({ isOpen, onClose, onSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        fName: '',
        lName: '',
        address: '',
        apt: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        phone2: '',
        email: '',
        photo: null,
        instagram: '',
        facebook: '',
        twitter: '',
        tiktok: '',
        linkedin: '',
        notes: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file
            }));
            
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fName.trim()) newErrors.fName = 'First name is required';
        if (!formData.lName.trim()) newErrors.lName = 'Last name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (formData.state.length !== 2) newErrors.state = 'State must be 2 characters';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP code is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    submitData.append(key, formData[key]);
                }
            });

            const token = await user.getIdToken();
            const response = await fetch('/api/admin/clients', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData,
            });

            const result = await response.json();

            if (response.ok) {
                onSuccess(result.client);
                handleClose();
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                } else {
                    alert('Error creating client: ' + (result.message || 'Unknown error'));
                }
            }
        } catch (error) {
            console.error('Error creating client:', error);
            alert('Error creating client. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            fName: '',
            lName: '',
            address: '',
            apt: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            phone2: '',
            email: '',
            photo: null,
            instagram: '',
            facebook: '',
            twitter: '',
            tiktok: '',
            linkedin: '',
            notes: ''
        });
        setErrors({});
        setPhotoPreview(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-semibold">Add New Client</CardTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClose}
                        className="h-6 w-6"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Photo Upload */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center bg-muted overflow-hidden">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Client preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-8 w-8 text-muted-foreground" />
                                    )}
                                </div>
                                <label
                                    htmlFor="photo-upload"
                                    className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90"
                                >
                                    <Upload className="h-3 w-3" />
                                </label>
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fName">First Name *</Label>
                                <Input
                                    id="fName"
                                    name="fName"
                                    value={formData.fName}
                                    onChange={handleInputChange}
                                    className={cn(errors.fName && "border-destructive")}
                                />
                                {errors.fName && (
                                    <p className="text-sm text-destructive">{errors.fName}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lName">Last Name *</Label>
                                <Input
                                    id="lName"
                                    name="lName"
                                    value={formData.lName}
                                    onChange={handleInputChange}
                                    className={cn(errors.lName && "border-destructive")}
                                />
                                {errors.lName && (
                                    <p className="text-sm text-destructive">{errors.lName}</p>
                                )}
                            </div>
                        </div>

                        {/* Address Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={cn(errors.address && "border-destructive")}
                            />
                            {errors.address && (
                                <p className="text-sm text-destructive">{errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="apt">Apt/Unit</Label>
                                <Input
                                    id="apt"
                                    name="apt"
                                    value={formData.apt}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={cn(errors.city && "border-destructive")}
                                />
                                {errors.city && (
                                    <p className="text-sm text-destructive">{errors.city}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    maxLength={2}
                                    placeholder="CA"
                                    className={cn(errors.state && "border-destructive")}
                                />
                                {errors.state && (
                                    <p className="text-sm text-destructive">{errors.state}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code *</Label>
                                <Input
                                    id="zip"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleInputChange}
                                    className={cn(errors.zip && "border-destructive")}
                                />
                                {errors.zip && (
                                    <p className="text-sm text-destructive">{errors.zip}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={cn(errors.phone && "border-destructive")}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-destructive">{errors.phone}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone2">Secondary Phone</Label>
                                <Input
                                    id="phone2"
                                    name="phone2"
                                    type="tel"
                                    value={formData.phone2}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={cn(errors.email && "border-destructive")}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            )}
                        </div>

                        {/* Social Media Section */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-foreground border-b pb-2">Social Media (Optional)</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="flex items-center gap-2">
                                        <Instagram className="h-4 w-4" />
                                        Instagram
                                    </Label>
                                    <Input
                                        id="instagram"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        placeholder="@username or URL"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="facebook" className="flex items-center gap-2">
                                        <Facebook className="h-4 w-4" />
                                        Facebook
                                    </Label>
                                    <Input
                                        id="facebook"
                                        name="facebook"
                                        value={formData.facebook}
                                        onChange={handleInputChange}
                                        placeholder="Profile URL or username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="twitter" className="flex items-center gap-2">
                                        <Twitter className="h-4 w-4" />
                                        Twitter/X
                                    </Label>
                                    <Input
                                        id="twitter"
                                        name="twitter"
                                        value={formData.twitter}
                                        onChange={handleInputChange}
                                        placeholder="@username or URL"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                                        <Linkedin className="h-4 w-4" />
                                        LinkedIn
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="Profile URL"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tiktok" className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        TikTok
                                    </Label>
                                    <Input
                                        id="tiktok"
                                        name="tiktok"
                                        value={formData.tiktok}
                                        onChange={handleInputChange}
                                        placeholder="@username or URL"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes Section */}
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Additional notes about the client..."
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Client'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewClientModal;