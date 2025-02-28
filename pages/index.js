import { createClient } from "contentful";
import { VacationPanel } from "../components/VacationPanel";
import { useEffect, useState } from "react";

// We use the getStaticProps to grab any data and then use that data to inject props to our components
export async function getStaticProps() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: "recipe" });

  return {
    props: { recipes: res.items },
    revalidate: 1,
  };
}

export default function Recipes({ recipes }) {
  const [query, setQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState(recipes);

  useEffect(() => {
    const filtered = recipes.filter((city) => city.fields.title === query);
    if (filtered.length === 0) {
      setFilteredCities(recipes);
    } else {
      setFilteredCities(filtered);
    }
  }, [query]);

  return (
    <div className="container">
      <input value={query} onChange={(e) => setQuery(e.target.value)}></input>
      <div className="row">
        <h1 className="title-main">Vacations</h1>
        <div className="vacation-panels">
          {filteredCities.map((recipe) => (
            <div className="col-xs-12">
              <VacationPanel key={recipe.sys.id} recipe={recipe} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
