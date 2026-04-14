"use client";

import { toast } from "sonner";

export default function ToastTest() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => toast.success("สำเร็จ! ระบบทำงานปกติ")}
        className="px-4 py-2 rounded-lg bg-green-500 text-white text-[13px] font-semibold active:scale-95 transition-all"
      >
        Success
      </button>
      <button
        type="button"
        onClick={() => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")}
        className="px-4 py-2 rounded-lg bg-red-500 text-white text-[13px] font-semibold active:scale-95 transition-all"
      >
        Error
      </button>
      <button
        type="button"
        onClick={() => toast.info("นี่คือข้อความแจ้งเตือน")}
        className="px-4 py-2 rounded-lg bg-blue-500 text-white text-[13px] font-semibold active:scale-95 transition-all"
      >
        Info
      </button>
      <button
        type="button"
        onClick={() => toast.warning("โปรดระวัง!")}
        className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-[13px] font-semibold active:scale-95 transition-all"
      >
        Warning
      </button>
    </div>
  );
}
