import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — Furry Sitterz Admin" }] }),
});

function SettingsPage() {
  const [general, setGeneral] = useState({
    platformName: "Furry Sitterz",
    contactEmail: "help@furrysitterz.com",
    contactNumber: "+1 (555) 010-1288",
    tagline: "Trusted pet care from vetted sitters.",
  });
  const [platform, setPlatform] = useState({
    allowInstantBooking: true,
    autoAcceptVerified: false,
    minAdvance: "2",
    cancelWindow: "24",
  });
  const [reviews, setReviews] = useState({ moderation: true, minChars: "20", allowImages: true });
  const [community, setCommunity] = useState({ requireApproval: false, reportsThreshold: "3", banOnAbuse: true });

  return (
    <div>
      <PageHeader title="Settings" description="Configure global platform behavior and defaults." />

      <Tabs defaultValue="general">
        <TabsList className="rounded-full bg-card p-1">
          <TabsTrigger value="general" className="rounded-full">General</TabsTrigger>
          <TabsTrigger value="platform" className="rounded-full">Platform</TabsTrigger>
          <TabsTrigger value="booking" className="rounded-full">Booking</TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-full">Reviews</TabsTrigger>
          <TabsTrigger value="community" className="rounded-full">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">General information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><Label>Platform name</Label><Input value={general.platformName} onChange={(e) => setGeneral({ ...general, platformName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Contact email</Label><Input type="email" value={general.contactEmail} onChange={(e) => setGeneral({ ...general, contactEmail: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Contact number</Label><Input value={general.contactNumber} onChange={(e) => setGeneral({ ...general, contactNumber: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Logo</Label><Input type="file" accept="image/*" /></div>
              <div className="space-y-1.5 md:col-span-2"><Label>Tagline</Label><Textarea value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} className="min-h-[80px]" /></div>
              <div className="md:col-span-2"><Button className="rounded-full" onClick={() => toast.success("General settings saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platform">
          <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">Platform settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SettingRow label="Allow instant booking" description="Owners can book verified sitters without confirmation." checked={platform.allowInstantBooking} onChange={(v) => setPlatform({ ...platform, allowInstantBooking: v })} />
              <SettingRow label="Auto-accept verified sitters" description="Automatically approve bookings from top-rated sitters." checked={platform.autoAcceptVerified} onChange={(v) => setPlatform({ ...platform, autoAcceptVerified: v })} />
              <div><Button className="rounded-full" onClick={() => toast.success("Platform settings saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">Booking settings</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5"><Label>Min. advance booking (hours)</Label><Input type="number" value={platform.minAdvance} onChange={(e) => setPlatform({ ...platform, minAdvance: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Free cancellation window (hours)</Label><Input type="number" value={platform.cancelWindow} onChange={(e) => setPlatform({ ...platform, cancelWindow: e.target.value })} /></div>
              <div className="md:col-span-2"><Button className="rounded-full" onClick={() => toast.success("Booking settings saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">Review settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SettingRow label="Manual moderation" description="Review each new post before publishing." checked={reviews.moderation} onChange={(v) => setReviews({ ...reviews, moderation: v })} />
              <SettingRow label="Allow images in reviews" description="Owners can attach up to 3 images per review." checked={reviews.allowImages} onChange={(v) => setReviews({ ...reviews, allowImages: v })} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Minimum characters</Label><Input type="number" value={reviews.minChars} onChange={(e) => setReviews({ ...reviews, minChars: e.target.value })} /></div>
              </div>
              <div><Button className="rounded-full" onClick={() => toast.success("Review settings saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="mt-4 rounded-2xl border-border/60 shadow-soft">
            <CardHeader><CardTitle className="text-base">Community settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <SettingRow label="Require approval for new posts" description="Moderators approve every new post before it appears." checked={community.requireApproval} onChange={(v) => setCommunity({ ...community, requireApproval: v })} />
              <SettingRow label="Auto-suspend on abuse" description="Suspend accounts after threshold reports." checked={community.banOnAbuse} onChange={(v) => setCommunity({ ...community, banOnAbuse: v })} />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5"><Label>Reports threshold</Label><Input type="number" value={community.reportsThreshold} onChange={(e) => setCommunity({ ...community, reportsThreshold: e.target.value })} /></div>
              </div>
              <div><Button className="rounded-full" onClick={() => toast.success("Community settings saved")}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 p-4">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
