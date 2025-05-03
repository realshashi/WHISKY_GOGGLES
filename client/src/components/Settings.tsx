import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-medium text-secondary-color mb-3 app-heading">Settings</h3>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Camera Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-flash" className="text-sm">Auto Flash</Label>
              <Switch id="auto-flash" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="high-res" className="text-sm">High Resolution</Label>
              <Switch id="high-res" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-md">App Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="save-history" className="text-sm">Save Scan History</Label>
              <Switch id="save-history" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="location" className="text-sm">Location Tagging</Label>
              <Switch id="location" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-icons text-secondary-light">info</span>
              <span className="text-sm">App Version: 1.0.0</span>
            </div>
            
            <Separator />
            
            <div className="text-center">
              <span className="text-xs text-secondary-light">
                © 2023 Whisky Goggles. All rights reserved.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
