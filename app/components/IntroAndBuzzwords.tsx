import { IntroAndBuzzwordsProps } from "~/types";

export function IntroAndBuzzwords({
  introduction,
  buzzwords,
}: IntroAndBuzzwordsProps) {
  return (
    <section className="w-11/12 m-auto max-w-screen-lg py-8">
      <div className="flex justify-between gap-6">
        <div className="w-11/12 max-w-md pr-8">
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p className="text-sm leading-relaxed">{introduction}</p>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Buzzwords</h2>
          <ul className="list-none p-0 flex flex-wrap gap-2">
            {buzzwords.map((word, index) => (
              <li key={index} className="text-sm m-0 flex items-center">
                <span className="mr-2 my-0 leading-none t text-gray-400">
                  •
                </span>
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 border-b border-gray-400"></div>
    </section>
  );
}
