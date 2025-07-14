import { useState } from "react";
import { MessageSquare } from "lucide-react";

import AuthImagePattern from "../components/AuthImagePattern.jsx";
import { useAuthStore } from "../stores/auth";

const LoginPage = () => {
  const [setshowPassword, setSetshowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-11">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mt-2">Welcome Back!</h2>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome Back!"
        subtitle="Sign in to continue your conversation and catch up with your messages."
      />
    </div>
  );
};

export default LoginPage;
