import { useEffect } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const apiKey = localStorage.getItem("api_key");

  const isAdmin = user?.roles?.some((role) => role.name === "admin");

  // ตรวจ login และ redirect ถ้าไม่มี
  useEffect(() => {
    if (!user || !apiKey) {
      navigate("/login");
    }
  }, [user, apiKey, navigate]);

  const navigation = [
    { name: "Edit", href: "/Edit", show: isAdmin },
    { name: "Add Camera", href: "/AddCamera", show: isAdmin },
  ];

  const handleLogout = () => {
    localStorage.removeItem("api_key");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Disclosure
      as="nav"
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center sm:hidden">
            <DisclosureButton className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex items-center gap-3">
            <img
              alt="ZooCam Logo"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=500"
              className="h-8 w-8"
            />
            <Link to="/">
            <span className="font-semibold text-lg text-gray-800">
              ZooCam System
            </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:space-x-6">
            {navigation
              .filter((item) => item.show)
              .map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      isActive
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-500",
                      "transition-colors px-3 py-2 text-sm"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
          </div>

          {/* Profile / Logout */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-gray-600 hover:text-blue-600 focus:outline-none">
              <BellIcon className="h-6 w-6" />
            </button>

            <Menu as="div" className="relative">
              <MenuButton className="flex items-center">
                <img
                  alt="Profile"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="h-8 w-8 rounded-full border border-gray-300"
                />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 focus:outline-none">
                {user ? (
                  <>
                    <MenuItem>
                      <span className="block px-4 py-2 text-sm text-gray-700">
                        {user.user_profile.first_name} {user.user_profile.last_name}
                      </span>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </>
                ) : (
                  <MenuItem>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                  </MenuItem>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="space-y-1 px-4 py-3">
          {navigation
            .filter((item) => item.show)
            .map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    isActive
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100",
                    "block rounded-md px-3 py-2 text-base"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              );
            })}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
