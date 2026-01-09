"use client";

import { Button, Card, CardContent } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/secondary-primitives";
import { auth } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { FilePlus, History } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    storage.getAllAnalyses().then(data => {
      // Sort by timestamp desc
      setHistory(data.sort((a, b) => b.timestamp - a.timestamp));
    });
  }, []);

  const handleLogout = () => {
    auth.logout();
    router.push("/login");
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
       <header className="flex justify-between items-center mb-8">
         <div>
           <h1 className="text-3xl font-black tracking-tighter">DEGEN ANALYST</h1>
           <p className="text-sm text-muted-foreground font-mono">Guilty until proven otherwise</p>
         </div>
         <Button variant="outline" onClick={handleLogout}>Logout</Button>
       </header>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
         <Link href={`/analysis?id=${Date.now()}`} className="block">
           <Card className="h-full hover:bg-slate-50 transition-colors border-dashed border-2 cursor-pointer flex flex-col items-center justify-center p-6 text-slate-400 hover:text-slate-600 hover:border-slate-400">
             <FilePlus className="w-12 h-12 mb-2" />
             <span className="font-bold">NEW ANALYSIS</span>
           </Card>
         </Link>
       </div>

       <div className="space-y-4">
         <h2 className="text-xl font-bold flex items-center">
           <History className="mr-2 w-5 h-5" /> History
         </h2>
         {history.length === 0 ? (
           <p className="text-muted-foreground italic">No analysis records found.</p>
         ) : (
           <div className="grid gap-4">
             {history.map(item => (
               <Link href={`/analysis?id=${item.id}`} key={item.id}>
                 <Card className="hover:shadow-md transition-shadow">
                   <CardContent className="flex items-center justify-between p-4">
                     <div>
                       <div className="font-bold text-lg">{item.ticker || "UNKNOWN"}</div>
                       <div className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</div>
                     </div>
                     <Badge variant={item.result === 'PASS' ? 'success' : item.result === 'RISK' ? 'warning' : 'destructive'}>
                       {item.result}
                     </Badge>
                   </CardContent>
                 </Card>
               </Link>
             ))}
           </div>
         )}
       </div>
    </div>
  );
}
