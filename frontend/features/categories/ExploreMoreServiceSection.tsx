
const ExploreMoreServiceSection = ({
  title,
  data,
}: {
  title: string;
  data: any;
}) => {
  if (!data) return null;

  return (
    <div className="p-8">
      <h2 className="w-full p-8 text-center text-2xl font-bold capitalize">
        Explore More {title} Service
      </h2>

      <div className="flex flex-wrap items-center justify-center">
        {data.map((_: any, index: any) => (
          <a
            key={index}
            href={_.link}
            // href={`#`}
            className="m-1 w-fit rounded-3xl bg-[#EFEFF0] px-4 py-1 font-medium hover:bg-gray-300"
          >
            {_.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExploreMoreServiceSection;
