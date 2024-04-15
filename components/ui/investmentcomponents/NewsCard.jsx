import { format } from "date-fns";
import CircleLoader from "Components/CircleLoader";
import { truncateString } from "Utils/utils";
const time = new Date().getTime();
const date = format(new Date(time), "MMM d, yyyy");

const dummyData = [
  {
    title: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
     title: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
     title: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
     title: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
     title: "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
];

const NewsCard = ({ news, isLoadingNews }) => {
  if (news?.length === 0 || news === undefined) news = dummyData; //to deal with rate limit


  return (
    <>
      <h3 className="font-bold text-lg mb-5">News about your investment</h3>
      <div className="flex flex-col gap-y-3">
        {isLoadingNews ? (
          <CircleLoader marginY={"!my-[9rem]"} />
        ) : (
          <>
            {news.map((datum, index) => {
              const dateCleaned = format(new Date(datum.published_utc), "MMM d, yyyy");

              return (
                <div className="" key={`${datum.id}-${index}`}>
                  <a
                    className="text-sm hover:underline cursor-pointer"
                    href={datum.article_url}
                    data-testid="stock-news-title-test-id"
                    title = {datum.title}
                  >
                    {truncateString(datum.title,85)}
                  </a>
                  <p className="text-slate-400 text-xs">
                    {datum.publisher.name} &#183; <span>{dateCleaned}</span>
                  </p>
                </div>
              );
            })}

            <p className="text-primary hover:underline cursor-pointer">View More</p>
          </>
        )}
      </div>
    </>
  );
};

export default NewsCard;
