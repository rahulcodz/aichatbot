import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const projects = [
  { name: "Marketing Site", status: "In review", owner: "Olivia", progress: "72%" },
  { name: "Mobile App", status: "In progress", owner: "Ethan", progress: "48%" },
  { name: "Analytics", status: "Planning", owner: "Sofia", progress: "12%" },
];

const notifications = [
  { title: "New comment", detail: "Jackson left feedback on the landing page." },
  { title: "Deploy succeeded", detail: "Production build finished in 2m 41s." },
  { title: "Invoice paid", detail: "Acme Corp paid $12,400." },
];

export default function UPage() {
  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, Rahul</CardTitle>
            <CardDescription>Here is a quick snapshot of your workspace.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Active projects</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Tasks due</p>
              <p className="text-2xl font-semibold">8</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Team members</p>
              <p className="text-2xl font-semibold">24</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Common tasks for your team.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button>Create project</Button>
            <Button variant="outline">Schedule review</Button>
            <Button variant="secondary">Invite teammate</Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Keep an eye on team progress.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-xs text-muted-foreground">3 ongoing initiatives</p>
              </div>
              <div className="flex w-full max-w-xs items-center gap-2">
                <Input placeholder="Filter projects..." />
                <Button variant="outline">Search</Button>
              </div>
            </div>
            <Separator />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.status}</Badge>
                    </TableCell>
                    <TableCell>{project.owner}</TableCell>
                    <TableCell className="text-right">{project.progress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Latest updates from the team.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {notifications.map((item) => (
              <div key={item.title} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
