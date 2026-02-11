import { ThemeSwitcher } from "@/components/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const colorSwatches = [
  { name: "Primary", className: "bg-primary text-primary-foreground" },
  { name: "Secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "Accent", className: "bg-accent text-accent-foreground" },
  { name: "Muted", className: "bg-muted text-muted-foreground" },
  { name: "Card", className: "bg-card text-card-foreground border" },
  { name: "Popover", className: "bg-popover text-popover-foreground border" },
  { name: "Destructive", className: "bg-destructive text-destructive-foreground" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tweak-style theme playground</p>
            <h1 className="text-2xl font-semibold tracking-tight">Shadcn UI Theme Editor</h1>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Switch themes and see tokens update instantly.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {colorSwatches.map((swatch) => (
                <div key={swatch.name} className={`rounded-lg border p-4 ${swatch.className}`}>
                  <p className="text-sm font-medium">{swatch.name}</p>
                  <p className="text-xs opacity-80">background / foreground</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Buttons and badges with theme-aware colors.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
              <Badge>Pro</Badge>
              <Badge variant="secondary">Beta</Badge>
              <Badge variant="outline">Preview</Badge>
              <Badge variant="destructive">Alert</Badge>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Forms</CardTitle>
              <CardDescription>Inputs, selects, and toggles that reflect your palette.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Plan</Label>
                  <Select defaultValue="pro">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Tell us about your project..." />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch id="alerts" defaultChecked />
                  <Label htmlFor="alerts">Email alerts</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Label>Daily goal</Label>
                  <Slider defaultValue={[60]} max={120} step={5} className="w-40" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Menu</CardTitle>
              <CardDescription>Dropdowns and tooltips stay on theme.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Invite</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>Theme-aware tooltip</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
            <Separator className="my-4" />
            <CardFooter className="flex flex-col items-start gap-3">
              <p className="text-sm text-muted-foreground">Give your UI a polished look.</p>
              <Button className="w-full">Upgrade Plan</Button>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
              <CardDescription>Switch between views with clean elevation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-semibold">$15,231.89</p>
                  </div>
                </TabsContent>
                <TabsContent value="activity">
                  <p className="text-sm text-muted-foreground">You are up 18% from last month.</p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="text-sm text-muted-foreground">Adjust preferences to match your workflow.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Table uses border and muted colors.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { status: "success", email: "ken99@example.com", amount: "$316.00" },
                    { status: "processing", email: "monserrat44@example.com", amount: "$837.00" },
                    { status: "failed", email: "carmella@example.com", amount: "$721.00" },
                  ].map((row) => (
                    <TableRow key={row.email}>
                      <TableCell className="capitalize">{row.status}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell className="text-right">{row.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
