import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const ClientCard = ({ client, onEdit, onDelete }) => {
  const getInitials = (fName, lName) => {
    return `${fName?.charAt(0) || ''}${lName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const getSocialMediaIcon = (platform) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />;
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'tiktok': return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  const getSocialMediaUrl = (platform, value) => {
    if (!value) return '';
    
    // If it's already a URL, return as is
    if (value.startsWith('http')) return value;
    
    // Handle username formats
    const username = value.startsWith('@') ? value.slice(1) : value;
    
    switch (platform) {
      case 'instagram': return `https://instagram.com/${username}`;
      case 'facebook': return value.includes('/') ? `https://facebook.com/${value}` : `https://facebook.com/${username}`;
      case 'twitter': return `https://twitter.com/${username}`;
      case 'linkedin': return value.includes('linkedin.com') ? value : `https://linkedin.com/in/${username}`;
      case 'tiktok': return `https://tiktok.com/@${username}`;
      default: return value;
    }
  };

  const socialMediaPlatforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
  const activeSocialMedia = socialMediaPlatforms.filter(platform => client[platform]);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <Avatar className="h-16 w-16">
              {client.photo_path ? (
                <AvatarImage 
                  src={`/storage/${client.photo_path}`} 
                  alt={`${client.fName} ${client.lName}`}
                />
              ) : null}
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials(client.fName, client.lName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Client Information */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {client.fName} {client.lName}
              </h3>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(client)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(client)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <div>{client.address}{client.apt ? `, ${client.apt}` : ''}</div>
                <div>{client.city}, {client.state} {client.zip}</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
              <a 
                href={`mailto:${client.email}`}
                className="hover:text-primary transition-colors truncate"
              >
                {client.email}
              </a>
            </div>

            {/* Phone Numbers */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a 
                  href={`tel:${client.phone}`}
                  className="hover:text-primary transition-colors"
                >
                  {formatPhoneNumber(client.phone)}
                </a>
                <Badge variant="outline" className="ml-2 text-xs">Primary</Badge>
              </div>
              {client.phone2 && (
                <div className="flex items-center text-sm text-muted-foreground ml-6">
                  <a 
                    href={`tel:${client.phone2}`}
                    className="hover:text-primary transition-colors"
                  >
                    {formatPhoneNumber(client.phone2)}
                  </a>
                  <Badge variant="outline" className="ml-2 text-xs">Secondary</Badge>
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            {activeSocialMedia.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                {activeSocialMedia.map(platform => (
                  <a
                    key={platform}
                    href={getSocialMediaUrl(platform, client[platform])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground hover:text-primary transition-colors"
                    title={`${platform}: ${client[platform]}`}
                  >
                    {getSocialMediaIcon(platform)}
                  </a>
                ))}
              </div>
            )}

            {/* Notes */}
            {client.notes && (
              <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-3 mt-3">
                <p className="line-clamp-3">{client.notes}</p>
              </div>
            )}

            {/* Client Since */}
            <div className="text-xs text-muted-foreground mt-3 pt-3 border-t">
              Client since {new Date(client.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;