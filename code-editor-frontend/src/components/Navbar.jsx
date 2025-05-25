export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white shadow">
      <div className="text-xl font-bold">
        <a href="/">CodeEditor</a>
      </div>
      <div className="w-10 h-10 bg-gray-600 rounded-full" />
    </div>
  );
}
