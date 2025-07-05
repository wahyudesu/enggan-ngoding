import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FAQ from './faq';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181b] via-[#23243a] to-[#ff6f3c] flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ff6f3c] via-[#ff3c6f] to-[#a259ff] flex items-center justify-center text-white font-bold text-xl">
            🧡
          </span>
          <span className="text-xl font-bold text-white">Enggangoding</span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="bg-[#232323] text-white hover:bg-[#333] px-5"
          >
            Log in
          </Button>
          <Button className="bg-white text-black font-semibold px-5 hover:bg-[#ff6f3c] hover:text-white transition">
            Get started
          </Button>
        </div>
      </nav>

      {/* Content Section (scrollable) */}
      <div className="flex-1 flex flex-col items-center w-full overflow-y-auto py-28">
        <main className="w-full flex flex-col items-center justify-center text-center px-4 py-28 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Ingin jadi programmer handal namun enggan ngoding?
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10">
            vibe coding solusinya
          </p>

          {/* Prompt Card */}
          <Card className="w-full p-0 max-w-2xl bg-[#232323] border-none shadow-lg mb-6">
            <CardContent className="p-4 flex flex-col gap-4">
              <Input
                className="bg-transparent border-none text-white placeholder:text-gray-400 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Ask Lovable to create a blog about..."
              />
              <div className="flex justify-end">
                <Button
                  size="icon"
                  className="bg-[#333] text-white hover:bg-[#ff6f3c]"
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path
                      d="M10 4v8m0 0l3-3m-3 3l-3-3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Badge className="bg-[#232323] text-white px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="7" stroke="#ff6f3c" strokeWidth="2" />
              </svg>
              Fitness tracker
            </Badge>
            <Badge className="bg-[#232323] text-white px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer">
              Remotion video
            </Badge>
            <Badge className="bg-[#232323] text-white px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer">
              Personal website
            </Badge>
            <Badge className="bg-[#232323] text-white px-5 py-2 rounded-full flex items-center gap-2 cursor-pointer">
              3D product viewer
            </Badge>
          </div>
        </main>

        {/* FAQ Section */}
        <section className="max-w-2xl mx-auto w-full mt-12 mb-8 px-4">
          <FAQ />
        </section>
      </div>
    </div>
  );
}
