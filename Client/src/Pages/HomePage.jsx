import HomePageSideBar from '../Component/HomePageSidebar'
const HomePage = ({ children }) => {
  return (
<div className="flex h-screen w-screen overflow-hidden bg-[#0b0b0b] text-white">

  {/* Main Content */}
  <main className="flex-1 overflow-y-auto">
    {children}
  </main>

</div>
  );
};

export default HomePage;