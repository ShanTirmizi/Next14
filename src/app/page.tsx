import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <h1>Hello World</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
