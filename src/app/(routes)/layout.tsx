import SideNavigation from '@/components/side-navigation/side-navigation';

const RoutesLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      <div className="w-[200px]">
        <SideNavigation />
      </div>
      {children}
    </div>
  );
};

export default RoutesLayout;
