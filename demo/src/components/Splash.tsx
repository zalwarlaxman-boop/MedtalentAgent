import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type SplashProps = {
  open: boolean;
  onClose: () => void;
};

export default function Splash({ open, onClose }: SplashProps) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleGetCode = () => {
    if (!phone || phone.length !== 11) {
      alert("请输入正确的手机号");
      return;
    }
    setIsSending(true);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    onClose();
  };

  const handleGuest = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="splash-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20"
        >
          <div className="w-full max-w-[480px] h-full flex flex-col items-center px-6 pt-10 pb-10 overflow-y-auto bg-[#faf9f5] shadow-2xl">
            {/* Brand Section */}
            <div className="w-full flex flex-col items-center justify-center text-center mt-8 mb-10">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                className="text-[28px] font-semibold text-[#141413] tracking-tight font-heading"
              >
                ***医生的智能体空间
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                className="mt-4 text-[15px] text-[#717069] leading-relaxed font-serif max-w-[22rem]"
              >
                让健康触手可及，做自己健康第一责任人
              </motion.p>
            </div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
              className="w-full bg-white rounded-2xl p-6 shadow-sm border border-[#e8e6dc]/50"
            >
              <h2 className="text-[18px] font-medium text-[#141413] mb-6 font-heading">账号密码登录</h2>
              
              {/* Account Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] text-[#717069] mb-2">账号</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入账号"
                    className="w-full px-4 py-3 rounded-xl border border-[#e8e6dc] bg-[#faf9f5] text-[#141413] text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[#6a9bcc] placeholder:text-[#b0aea5] transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-[14px] text-[#717069] mb-2">密码</label>
                  <div className="flex gap-3">
                    <input
                      type="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="请输入密码"
                      className="flex-1 px-4 py-3 rounded-xl border border-[#e8e6dc] bg-[#faf9f5] text-[#141413] text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-[#6a9bcc] placeholder:text-[#b0aea5] transition-colors"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full py-3.5 rounded-xl bg-[#6a9bcc] text-white text-[16px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#6a9bcc] focus-visible:ring-offset-2 active:scale-[0.98] transition-all mt-4"
                >
                  登录
                </button>
              </div>
            </motion.div>

            {/* Guest Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.5, ease: "easeOut" }}
              className="mt-6"
            >
              <button
                type="button"
                onClick={handleGuest}
                className="text-[14px] text-[#717069] hover:text-[#6a9bcc] underline underline-offset-4 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#6a9bcc] rounded px-1"
              >
                游客浏览
              </button>
            </motion.div>

            {/* Bottom Slogan */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.5, ease: "easeOut" }}
              className="mt-auto pt-8 text-center text-[14px] text-[#b0aea5] font-serif space-y-1"
            >
              <div>生了病，不担心</div>
              <div>少生病，更健康</div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

