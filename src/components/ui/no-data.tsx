import { cn } from "@/lib/utils";
import noDataImage from "@/assets/no-data-found.jpg";

interface NoDataProps {
  message?: string;
  className?: string;
  imageClassName?: string;
}

export const NoData = ({ 
  message = "No Data Found", 
  className,
  imageClassName 
}: NoDataProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-8 px-4",
      className
    )}>
      <img
        src={noDataImage}
        alt="No data found"
        className={cn(
          "w-full h-auto rounded-lg shadow-md transition-transform hover:scale-105",
          "max-w-[300px]",
          imageClassName
        )}
      />
      <p className="text-muted-foreground text-sm mt-4 text-center font-medium">
        {message}
      </p>
    </div>
  );
};