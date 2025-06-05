// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "./Sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [adminData, setAdminData] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     const admin = localStorage.getItem("adminData");

//     if (!token || !admin) {
//       router.push("/login");
//       return;
//     }

//     setAdminData(JSON.parse(admin));
//   }, [router]);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top Navigation */}
//         <div className="bg-white shadow">
//           <div className="mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 justify-between">
//               <div className="flex">
//                 <div className="flex flex-shrink-0 items-center">
//                   <h1 className="text-xl font-semibold text-gray-900">
//                     Admin Dashboard
//                   </h1>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-500 mr-4">
//                   Welcome, {adminData?.name || "Admin"}
//                 </span>
//                 <button
//                   onClick={() => {
//                     localStorage.removeItem("adminToken");
//                     localStorage.removeItem("adminData");
//                     router.push("/login");
//                   }}
//                   className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="mx-auto max-w-7xl">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "./Sidebar";
// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// const connectToSocket = (token: string) => {
//   if (!socket) {
//     socket = io("https://logistics-backend-1-s91j.onrender.com", {
//       auth: { token },
//     });
//     socket.on("connect", () => {
//       console.log("✅ Admin connected to socket:", socket?.id);
//       socket?.emit("join", "admin"); // <-- Join the 'admin' room here
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Admin socket disconnected");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("⚠️ Admin socket error:", err.message);
//     });

//     socket.on("new-order", (data) => {
//       console.log("📦 New order received (admin):", data);
//       // You can display a toast or update the UI here
//     });
//   }
// };

// const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     console.log("👋 Admin socket disconnected on unmount");
//   }
// };

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [adminData, setAdminData] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     const admin = localStorage.getItem("adminData");

//     if (!token || !admin) {
//       router.push("/login");
//       return;
//     }

//     setAdminData(JSON.parse(admin));

//     // Connect to socket when token is available
//     connectToSocket(token);

//     return () => {
//       disconnectSocket();
//     };
//   }, [router]);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Top Navigation */}
//         <div className="bg-white shadow">
//           <div className="mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 justify-between">
//               <div className="flex">
//                 <div className="flex flex-shrink-0 items-center">
//                   <h1 className="text-xl font-semibold text-gray-900">
//                     Admin Dashboard
//                   </h1>
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <span className="text-sm text-gray-500 mr-4">
//                   Welcome, {adminData?.name || "Admin"}
//                 </span>
//                 <button
//                   onClick={() => {
//                     localStorage.removeItem("adminToken");
//                     localStorage.removeItem("adminData");
//                     router.push("/login");
//                   }}
//                   className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="mx-auto max-w-7xl">{children}</div>
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { io, Socket } from "socket.io-client";
import Link from "next/link";

let socket: Socket | null = null;

const connectToSocket = (
  token: string,
  setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!socket) {
    socket = io("https://logistics-backend-1-s91j.onrender.com", {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("✅ Admin connected to socket:", socket?.id);
      socket?.emit("join", "admin");
    });

    socket.on("disconnect", () => {
      console.log("❌ Admin socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Admin socket error:", err.message);
    });

    socket.on("new-order", (data) => {
      console.log("📦 New order received (admin):", data);
      setNewOrderNotification(true);
    });
  }
};

const disconnectSocket = (
  setNewOrderNotification: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (socket) {
    socket.disconnect();
    socket = null;
    setNewOrderNotification(false); // ✅ Now this works
    console.log("👋 Socket disconnected on unmount");
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [adminData, setAdminData] = useState<any>(null);
  const [newOrderNotification, setNewOrderNotification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminData");

    if (!token || !admin) {
      router.push("/login");
      return;
    }

    setAdminData(JSON.parse(admin));
    connectToSocket(token, setNewOrderNotification);

    return () => {
      disconnectSocket(setNewOrderNotification); // ✅ Pass it here
    };
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white shadow">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between items-center">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Admin Dashboard
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Welcome, {adminData?.name || "Admin"}
                  </span>
                  {newOrderNotification && (
                    <Link
                      href="/admin/orders"
                      className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded"
                    >
                      New Order
                    </Link>
                  )}
                </div>

                <button
                  onClick={() => {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("adminData");
                    router.push("/login");
                  }}
                  className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
