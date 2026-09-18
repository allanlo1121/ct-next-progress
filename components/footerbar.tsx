import Image from "next/image"

type FooterBarProps = {
  projectName?: string | null
}

export function FooterBar({ projectName }: FooterBarProps) {
  return (
    <footer className="relative flex flex-row h-12 w-full shrink-0 items-center justify-center   bg-dashboard-background text-white ">
     
        <Image
          src="/logo.svg"
          alt="Logo"
          width={22}
          height={22}
          className="h-5 w-auto object-contain"
        />

        {projectName && (
          <span className="pl-2 text-base font-medium tracking-[0.08em] text-brand-800">
            {projectName}
          </span>
        )}
      
    </footer>
  )
}
