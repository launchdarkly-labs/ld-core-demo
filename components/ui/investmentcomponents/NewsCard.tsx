import { format } from "date-fns";
import { BounceLoader } from "react-spinners";
import { truncateString } from "@/utils/utils";

const time = new Date().getTime();
const date = format(new Date(time), "MMM d, yyyy");

const dummyData = [
  {
    title:
      "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
    title:
      "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
    title:
      "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
    title:
      "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
  {
    title:
      "S&P 500 scales new high on upbeat corporate earning. Tech heavyweight Microsoft Corp edged 0.7% higher, while Advanced Micro Devices Inc dipped 0.2%. Both the companies are expected to report earnings after markets close.",
    publisher: {
      name: "Reuters",
    },
    published_utc: date,
  },
];

const NewsCard = ({ news, isLoadingNews }: { news: any; isLoadingNews: boolean }) => {
  if (news?.length === 0 || news === undefined) news = dummyData; //to deal with rate limit

  return (
    <>
      <h3 className="font-bold text-lg mb-4">News about your investment</h3>
      <div className="flex flex-col gap-y-2 mb-4">
        {isLoadingNews ? (
          <BounceLoader marginy={"!my-[9rem]"} />
        ) : (
          <>
            {news.map((datum: any, index: number) => {
              const dateCleaned = format(new Date(datum.published_utc), "MMM d, yyyy");

              return (
                <div className="" key={`${datum.id}-${index}`}>
                  <a
                    className="text-sm hover:underline cursor-pointer"
                    href={datum.article_url}
                    data-testid="stock-news-title-test-id"
                    title={datum.title}
                  >
                    {truncateString(datum.title, 60)}
                  </a>
                  <p className="text-investmentgrey text-xs">
                    {datum.publisher.name} &#183; <span>{dateCleaned}</span>
                  </p>
                </div>
              );
            })}
          </>
        )}
      </div>
      <p className="text-investmentblue hover:underline cursor-default text-center">View More</p>
    </>
  );
};

export default NewsCard;
