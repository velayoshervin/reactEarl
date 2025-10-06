import { useRef, useMemo } from "react";
import { Button } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
} from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import PackageViewer from "./PackageViewer";

const PackageOptions = ({ packages, setSelectedPackages }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const MemoizedPackageOptions = useMemo(
    () => (
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
        >
          <IconChevronLeft size={22} />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth space-x-4 px-8 scrollbar-hide"
        >
          {packages.map((p) => (
            <div
              key={p.itemId}
              className="min-w-[280px] flex-shrink-0 border border-gray-200 p-4 rounded shadow-sm bg-white transition-transform duration-200"
            >
              <PackageViewer pkg={p} />

              <Button
                mt="sm"
                fullWidth
                onClick={() => {
                  setSelectedPackages((prev) => {
                    const exists = prev.some((pkg) => pkg.itemId === p.itemId);
                    if (exists) return prev;
                    return [...prev, p];
                  });
                  showNotification({
                    title: "Package added",
                    message: `${p.name} added`,
                    color: "green",
                    icon: <IconCheck />,
                  });
                }}
              >
                Add Package
              </Button>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-2"
        >
          <IconChevronRight size={22} />
        </button>
      </div>
    ),
    [packages, setSelectedPackages]
  );

  return MemoizedPackageOptions;
};

export default PackageOptions;
