import { useEffect } from "react";
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
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

  useEffect(() => {
    if (!user || !apiKey) navigate("/login");
  }, [user, apiKey, navigate]);

  const navigation = [
    { name: "Edit", href: "/edit", show: isAdmin },
    { name: "Add Camera", href: "/AddCamera", show: isAdmin },
  ];

  const handleLogout = () => {
    localStorage.removeItem("api_key");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Disclosure as="nav" className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-200">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              
              {/* Mobile menu button
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none">
                  {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </Disclosure.Button>
              </div> */}

              {/* Logo */}
              <div className="flex items-center gap-3">
                <Link to="/" className="text-lg font-semibold text-gray-800">
                  ZooCam System
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
                          isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-500",
                          "px-3 py-2 text-sm transition-colors"
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
              </div>

              {/* Profile dropdown */}
              {user && (
                <div className="flex items-center gap-4">
                  <Menu as="div" className="relative">
                    <MenuButton className="flex items-center gap-2">
                      <div className="text-left">
                        <div className="text-gray-800 font-semibold text-sm">
                          User : {user.user_profile.first_name} {user.user_profile.last_name}
                        </div>
                        <div className="text-xs text-gray-500"> position : {isAdmin ? "Admin" : "User"}</div>
                      </div>
                    </MenuButton>
                    <MenuItems className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-md ring-1 ring-gray-200">
                      <MenuItem>
                        <span className="block px-4 py-2 text-sm text-gray-800">
                          {user.user_profile.first_name} {user.user_profile.last_name}
                        </span>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu panel
          <Disclosure.Panel className="sm:hidden border-t border-gray-200 bg-white">
            <div className="space-y-1 px-4 py-3">
              {navigation
                .filter((item) => item.show)
                .map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        isActive ? "bg-gray-100 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100",
                        "block rounded-md px-3 py-2 text-base"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  );
                })}
            </div>
          </Disclosure.Panel> */}
        </>
      )}
    </Disclosure>
  );
}
