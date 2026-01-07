import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>shadcn/ui is installed!</CardTitle>
          <CardDescription>
            Next.js + TypeScript + Tailwind CSS + shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All components are now available: Button, Card, Input, Select, Badge, Dialog, Tabs, and Table.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
