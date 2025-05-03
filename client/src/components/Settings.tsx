import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Settings() {
  const [cameraSettings, setCameraSettings] = useState({
    autoFlash: false,
    highResolution: true,
    preferredCamera: 'back'
  });
  
  const [appPreferences, setAppPreferences] = useState({
    saveHistory: true,
    locationTagging: false,
    darkMode: false,
    priceSortOrder: 'msrp'
  });
  
  const handleCameraSettingChange = (setting: string, value: boolean | string) => {
    setCameraSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleAppPreferenceChange = (preference: string, value: boolean | string) => {
    setAppPreferences(prev => ({
      ...prev,
      [preference]: value
    }));
  };
  
  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-secondary-color mb-4 app-heading flex items-center">
        <span className="material-icons mr-2">settings</span>
        Settings
      </h3>
      
      <Card className="mb-5 shadow-md overflow-hidden border-0">
        <CardHeader className="bg-primary-color/10 pb-2">
          <CardTitle className="text-lg text-secondary-color flex items-center">
            <span className="material-icons text-primary-color mr-2">photo_camera</span>
            Camera Settings
          </CardTitle>
          <CardDescription className="text-secondary-light text-xs">
            Configure how the scanner captures images
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-flash" className="text-sm font-medium">Auto Flash</Label>
                <p className="text-xs text-secondary-light mt-0.5">Automatically enable flash in low light</p>
              </div>
              <Switch 
                id="auto-flash" 
                checked={cameraSettings.autoFlash}
                onCheckedChange={(checked) => handleCameraSettingChange('autoFlash', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="high-res" className="text-sm font-medium">High Resolution</Label>
                <p className="text-xs text-secondary-light mt-0.5">Capture in higher resolution for better accuracy</p>
              </div>
              <Switch 
                id="high-res" 
                checked={cameraSettings.highResolution}
                onCheckedChange={(checked) => handleCameraSettingChange('highResolution', checked)}
              />
            </div>
            <div className="pt-1">
              <Label htmlFor="camera-select" className="text-sm font-medium mb-1 block">Preferred Camera</Label>
              <Select 
                value={cameraSettings.preferredCamera}
                onValueChange={(value) => handleCameraSettingChange('preferredCamera', value)}
              >
                <SelectTrigger id="camera-select" className="w-full bg-neutral-color">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="back">Back Camera (Recommended)</SelectItem>
                  <SelectItem value="front">Front Camera</SelectItem>
                  <SelectItem value="auto">Auto-detect Best Camera</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-secondary-light mt-1.5">Back camera typically provides better image quality</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-5 shadow-md overflow-hidden border-0">
        <CardHeader className="bg-primary-color/10 pb-2">
          <CardTitle className="text-lg text-secondary-color flex items-center">
            <span className="material-icons text-primary-color mr-2">tune</span>
            App Preferences
          </CardTitle>
          <CardDescription className="text-secondary-light text-xs">
            Customize your Whisky Goggles experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="save-history" className="text-sm font-medium">Save Scan History</Label>
                <p className="text-xs text-secondary-light mt-0.5">Keep a record of scanned bottles</p>
              </div>
              <Switch 
                id="save-history" 
                checked={appPreferences.saveHistory}
                onCheckedChange={(checked) => handleAppPreferenceChange('saveHistory', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location" className="text-sm font-medium">Location Tagging</Label>
                <p className="text-xs text-secondary-light mt-0.5">Add store location to price records</p>
              </div>
              <Switch 
                id="location" 
                checked={appPreferences.locationTagging}
                onCheckedChange={(checked) => handleAppPreferenceChange('locationTagging', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-sm font-medium">Dark Mode</Label>
                <p className="text-xs text-secondary-light mt-0.5">Use dark theme (Coming soon)</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={appPreferences.darkMode}
                onCheckedChange={(checked) => handleAppPreferenceChange('darkMode', checked)}
                disabled
              />
            </div>
            <div className="pt-1">
              <Label htmlFor="price-sort" className="text-sm font-medium mb-1 block">Default Price Comparison</Label>
              <Select 
                value={appPreferences.priceSortOrder}
                onValueChange={(value) => handleAppPreferenceChange('priceSortOrder', value)}
              >
                <SelectTrigger id="price-sort" className="w-full bg-neutral-color">
                  <SelectValue placeholder="Select price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="msrp">MSRP (Manufacturer's Suggested Price)</SelectItem>
                  <SelectItem value="fair">Fair Price</SelectItem>
                  <SelectItem value="shelf">Average Shelf Price</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md border-0">
        <CardHeader className="bg-primary-color/10 pb-2">
          <CardTitle className="text-lg text-secondary-color flex items-center">
            <span className="material-icons text-primary-color mr-2">info</span>
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-color">App Version</span>
                <span className="text-sm font-medium bg-neutral-color px-2.5 py-1 rounded">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-color">Database</span>
                <span className="text-sm font-medium bg-neutral-color px-2.5 py-1 rounded">501 bottles</span>
              </div>
            </div>
            
            <div className="pt-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-1.5 py-5 text-primary-color border-primary-color/30">
                <span className="material-icons text-sm">help_outline</span>
                <span>Help & Support</span>
              </Button>
            </div>
            
            <Separator />
            
            <div className="text-center">
              <span className="text-xs text-secondary-light">
                © 2025 Whisky Goggles. All rights reserved.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
