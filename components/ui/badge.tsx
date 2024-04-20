interface BadgeProps {
  data: {
    label: string;
  };
}

const Badge: React.FC<BadgeProps> = ({ data }) => {
  return (
    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
      {data.label}
    </span>
  );
};
export default Badge;
