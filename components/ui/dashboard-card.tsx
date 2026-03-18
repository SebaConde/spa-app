const DashboardCard = ({
  title,
  value,
  caption,
}: {
  title: string;
  value: number;
  caption: string;
}) => {
  return (
    <div className="bg-gray-100 border-gray-400 p-5 flex flex-col gap-5 rounded">
      <h1 className="text-sm font-bold uppercase">{title}</h1>
      <h1 className="text-center text-6xl font-bold">{value}</h1>
      <h1 className="text-xs text-gray-600 ">{caption}</h1>
    </div>
  );
};

export default DashboardCard;
