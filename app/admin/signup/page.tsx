import { redirect } from "next/navigation";

export default function SignupPage() {
  redirect("/login");
}

// // app/admin/signup/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { AnimatedButton } from "@/components/ui/animated-button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Heart, Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
// import Link from "next/link";

// export default function AdminSignupPage() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "admin",
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validate passwords match
//     if (formData.password !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     // Validate password strength
//     if (formData.password.length < 8) {
//       toast.error("Password must be at least 8 characters long");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch("/api/auth/sign-up", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email,
//           password: formData.password,
//           role: formData.role,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         toast.success("Admin account created successfully! 🎉", {
//           description: "You can now log in with your credentials",
//         });

//         // Redirect to login page after 2 seconds
//         setTimeout(() => {
//           router.push("/admin/login");
//         }, 2000);
//       } else {
//         toast.error(data.error || "Failed to create account");
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-cream via-roseLight/20 to-white relative overflow-hidden flex items-center justify-center p-4">
//       {/* Decorative Background Elements */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-regalWine rounded-full blur-3xl" />
//         <div className="absolute bottom-40 right-20 w-96 h-96 bg-dustyPink rounded-full blur-3xl" />
//         <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-roseDark rounded-full blur-3xl" />
//       </div>

//       {/* Floating Hearts */}
//       <div className="absolute top-20 right-20 opacity-10">
//         <Heart
//           className="w-24 h-24 animate-float"
//           fill="currentColor"
//           style={{ color: "#6d1e3e" }}
//         />
//       </div>
//       <div className="absolute bottom-40 left-10 opacity-10">
//         <Heart
//           className="w-32 h-32 animate-float-slow"
//           fill="currentColor"
//           style={{ color: "#d4a5a5" }}
//         />
//       </div>

//       {/* Main Content */}
//       <div className="w-full max-w-md relative z-10">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div
//             className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
//             style={{
//               background: "linear-gradient(to bottom right, #6d1e3e, #d4a5a5)",
//             }}
//           >
//             <Shield className="w-8 h-8 text-white" />
//           </div>

//           <h1
//             className="text-4xl md:text-5xl font-cormorant font-bold mb-2"
//             style={{ color: "#6d1e3e" }}
//           >
//             Create Admin Account
//           </h1>
//           <p className="text-gray-600 font-montserrat">
//             Set up your administrative access
//           </p>
//         </div>

//         {/* Signup Form Card */}
//         <div
//           className="rounded-3xl shadow-2xl p-8 border-2"
//           style={{
//             backgroundColor: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(10px)",
//             borderColor: "#d4a5a5",
//           }}
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Name Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="name"
//                 className="text-base font-medium text-gray-700 flex items-center gap-2"
//               >
//                 <User className="w-4 h-4" style={{ color: "#6d1e3e" }} />
//                 Full Name
//               </Label>
//               <Input
//                 id="name"
//                 type="text"
//                 required
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 placeholder="John Doe"
//                 className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
//               />
//             </div>

//             {/* Email Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="email"
//                 className="text-base font-medium text-gray-700 flex items-center gap-2"
//               >
//                 <Mail className="w-4 h-4" style={{ color: "#6d1e3e" }} />
//                 Email Address
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 placeholder="admin@example.com"
//                 className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine"
//               />
//             </div>

//             {/* Password Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="password"
//                 className="text-base font-medium text-gray-700 flex items-center gap-2"
//               >
//                 <Lock className="w-4 h-4" style={{ color: "#6d1e3e" }} />
//                 Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   placeholder="••••••••"
//                   className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-regalWine transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500">
//                 Must be at least 8 characters long
//               </p>
//             </div>

//             {/* Confirm Password Field */}
//             <div className="space-y-2">
//               <Label
//                 htmlFor="confirmPassword"
//                 className="text-base font-medium text-gray-700 flex items-center gap-2"
//               >
//                 <Lock className="w-4 h-4" style={{ color: "#6d1e3e" }} />
//                 Confirm Password
//               </Label>
//               <div className="relative">
//                 <Input
//                   id="confirmPassword"
//                   type={showConfirmPassword ? "text" : "password"}
//                   required
//                   value={formData.confirmPassword}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   placeholder="••••••••"
//                   className="h-12 border-gray-300 focus:border-regalWine focus:ring-regalWine pr-12"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-regalWine transition-colors"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* Role Display */}
//             <div
//               className="p-4 rounded-xl border-2"
//               style={{
//                 backgroundColor: "rgba(109, 30, 62, 0.05)",
//                 borderColor: "#d4a5a5",
//               }}
//             >
//               <div className="flex items-center gap-2">
//                 <Shield className="w-5 h-5" style={{ color: "#6d1e3e" }} />
//                 <div>
//                   <p
//                     className="font-semibold text-sm"
//                     style={{ color: "#6d1e3e" }}
//                   >
//                     Administrator Role
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     Full access to manage RSVPs, gallery, and settings
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <AnimatedButton
//               type="submit"
//               disabled={isLoading}
//               loading={isLoading}
//               className="w-full h-14 text-lg"
//               size="lg"
//               variant="primary"
//               animation="slide"
//             >
//               <Shield className="w-5 h-5" />
//               Create Admin Account
//             </AnimatedButton>
//           </form>

//           {/* Already have account */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <Link
//                 href="/admin/login"
//                 className="font-semibold hover:underline"
//                 style={{ color: "#6d1e3e" }}
//               >
//                 Sign in here
//               </Link>
//             </p>
//           </div>
//         </div>

//         {/* Back to Home */}
//         <div className="mt-6 text-center">
//           <Link
//             href="/"
//             className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-regalWine transition-colors"
//           >
//             <Heart className="w-4 h-4" fill="currentColor" />
//             Back to Wedding Site
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
