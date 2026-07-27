import {
  FaCode,
  FaPaintBrush,
  FaBullhorn,
  FaChartLine,
  FaDatabase,
  FaUserTie,
} from "react-icons/fa";

const categoryConfig = [
  {
    id: 1,
    name: "Development",
    icon: <FaCode className="text-3xl text-blue-600" />,
  },
  {
    id: 2,
    name: "Design",
    icon: <FaPaintBrush className="text-3xl text-blue-600" />,
  },
  {
    id: 3,
    name: "Marketing",
    icon: <FaBullhorn className="text-3xl text-blue-600" />,
  },
  {
    id: 4,
    name: "Finance",
    icon: <FaChartLine className="text-3xl text-blue-600" />,
  },
  {
    id: 5,
    name: "Data Science",
    icon: <FaDatabase className="text-3xl text-blue-600" />,
  },
  {
    id: 6,
    name: "Management",
    icon: <FaUserTie className="text-3xl text-blue-600" />,
  },
];

export default function Categories({ categories }) {
  const mergedCategories = categoryConfig.map((item) => {
    const apiCategory = categories.find(
      (cat) => cat.name === item.name
    );

    return {
      ...item,
      jobs: apiCategory?.jobs || 0,
    };
  });

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Browse Job Categories
          </h2>

          <p className="text-gray-600 mt-3">
            Explore opportunities from different industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mergedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition text-center"
            >
              <div className="flex justify-center">
                {category.icon}
              </div>

              <h3 className="text-xl font-semibold mt-4">
                {category.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {category.jobs} Jobs Available
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}