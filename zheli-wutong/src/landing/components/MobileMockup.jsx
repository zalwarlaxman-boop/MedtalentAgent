export default function MobileMockup({ children }) {
  return (
    <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[80vh] min-h-[600px] w-[375px] shadow-xl overflow-hidden shrink-0 flex flex-col">
      {/* 刘海屏缺口 */}
      <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-3xl w-40 mx-auto z-50"></div>
      
      {/* 手机内容区 */}
      <div className="flex-1 relative overflow-hidden bg-white w-full h-full rounded-[1.5rem]">
        {children}
      </div>
    </div>
  );
}