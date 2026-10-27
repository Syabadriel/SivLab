function useTheme(isDark) {
  return {
    appBg: isDark ? "bg-slate-950" : "bg-[#f3f6f9]",
    sidebarBg: isDark ? "bg-slate-900 border-r-2 border-white" : "bg-white border-r-2 border-black",
    topbarBg: isDark ? "bg-slate-900 border-b-2 border-white" : "bg-white border-b-2 border-black",
    card: isDark
      ? "bg-slate-950 border-2 border-white shadow-[4px_4px_0px_#fff] rounded-[4px]"
      : "bg-white border-2 border-black shadow-[4px_4px_0px_#000] rounded-[4px]",
    cardHover: isDark
      ? "hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#fff] transition-all duration-100"
      : "hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#000] transition-all duration-100",
    border: isDark ? "border-white" : "border-black",
    borderStrong: isDark ? "border-white" : "border-black",
    text: isDark ? "text-white" : "text-black",
    textMuted: isDark ? "text-slate-200 font-semibold" : "text-slate-800 font-bold",
    textFaint: isDark ? "text-slate-400 font-semibold" : "text-slate-600 font-bold",
    hover: isDark ? "hover:bg-slate-800 hover:text-white" : "hover:bg-yellow-300 hover:text-black",
    rowHover: isDark ? "hover:bg-slate-800" : "hover:bg-slate-100",
    input: isDark
      ? "bg-slate-900 border-2 border-white text-white placeholder-slate-500 focus:shadow-[2px_2px_0px_#fff] transition-all font-bold rounded-[4px]"
      : "bg-white border-2 border-black text-black placeholder-slate-500 focus:shadow-[2px_2px_0px_#000] transition-all font-bold rounded-[4px]",
    tableHead: isDark
      ? "bg-slate-800 text-white border-b-2 border-white font-extrabold"
      : "bg-yellow-300 text-black border-b-2 border-black font-extrabold",
    divide: isDark ? "divide-white" : "divide-black",
    isDark,
  };
}

export default useTheme;
