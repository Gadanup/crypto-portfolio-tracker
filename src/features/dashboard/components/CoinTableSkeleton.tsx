import { Skeleton } from '@/components/ui';

const SKELETON_ROWS = 10;

const CoinTableSkeleton = (): React.JSX.Element => {
  return (
    <>
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <tr key={index} className="border-b border-border last:border-b-0">
          <td className="px-3 py-3">
            <Skeleton variant="text" className="h-4 w-6" />
          </td>
          <td className="px-3 py-3">
            <div className="flex items-center gap-2.5">
              <Skeleton variant="circle" className="h-7 w-7" />
              <div className="flex flex-col gap-1">
                <Skeleton variant="text" className="h-4 w-20" />
                <Skeleton variant="text" className="h-3 w-10" />
              </div>
            </div>
          </td>
          <td className="px-3 py-3">
            <Skeleton variant="text" className="ml-auto h-4 w-20" />
          </td>
          <td className="px-3 py-3">
            <Skeleton variant="text" className="ml-auto h-5 w-16" />
          </td>
          <td className="hidden px-3 py-3 md:table-cell">
            <Skeleton variant="text" className="ml-auto h-5 w-16" />
          </td>
          <td className="hidden px-3 py-3 lg:table-cell">
            <Skeleton variant="text" className="ml-auto h-4 w-20" />
          </td>
          <td className="hidden px-3 py-3 xl:table-cell">
            <Skeleton variant="text" className="ml-auto h-4 w-18" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default CoinTableSkeleton;
