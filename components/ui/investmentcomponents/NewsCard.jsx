import { format } from "date-fns";
import { BounceLoader } from "react-spinners";
import { truncateString } from  "@/utils/utils"
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
      <h3 className="font-bold text-lg mb-4">News about your investment</h3>
      <div className="flex flex-col gap-y-2 mb-4">
        {isLoadingNews ? (
          <BounceLoader marginY={"!my-[9rem]"} />
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

          
          </>
        )}
      </div>
      <p className="text-primary hover:underline cursor-pointer">View More</p>
    </>
  );
};

export default NewsCard;
