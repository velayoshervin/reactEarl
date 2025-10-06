import { useEffect, useState } from "react";
import ItemCard from "../../components/ItemCard";
import { ItemCardForAdmin } from "./ItemCardForAdmin";
import { getPagedItems, createItem } from "../../ItemsAxios";
import { Button } from "@mantine/core";
import ItemEdit from "./ItemEdit";
import { useDisclosure } from "@mantine/hooks";
import ItemForm from "./ItemForm";

//itemId

const PackagesAndServices = () => {
  const [items, setItems] = useState([]);
  //totalPages
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [activeItem, setActiveItem] = useState("");
  const [openCreateForm, setOpenCreateForm] = useState(false);

  const onClickHandler = (item) => {
    open();
    console.log("prop item: " + item);
    setActiveItem(item);
  };

  const onSubmitItem = (itemDetails) => {
    createItem({ item: itemDetails })
      .then((res) => {
        console.log("Updated item:", res.data);
        close();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getPagedItems(page, 10)
      .then((response) => {
        setItems(response.data?.content);
        setPage(response.data?.page);
        setTotalPages(response.data?.totalPages);
        setTotalElements(response.data?.totalElements);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [page]);

  useEffect(() => {
    console.log("Active item updated:", activeItem);
  }, [activeItem]);

  return (
    <div>
      <header className="flex"></header>
      <div className="text-start flex justify-between items-center mx-8">
        <p className="text-[14px]">
          results found <span className="text-gray-400">{totalElements}.</span>
        </p>
        <div
          className=" rounded-[60px] px-4 py-2 mr-2 text-[12px] bg-blue-600  inline-flex ml-auto text-white cursor-pointer hover:bg-blue-700"
          onClick={() => setOpenCreateForm(true)}
        >
          Add item
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 0}
          >
            Prev
          </Button>
          <Button
            variant="default"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 m-4 rounded-2xl">
        {items.map((item, idx) => (
          <div key={idx} className="w-[340px] h-full">
            <ItemCardForAdmin
              key={idx}
              {...item}
              editHandler={() => onClickHandler(item)}
            />
          </div>
        ))}
      </div>
      <div className="page">
        <div className="flex justify-center mt-6 space-x-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-400 rounded disabled:opacity-50 "
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)} // use i directly
              className={`px-4 py-2 rounded ${
                page === i ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1} {/* still display 1-based for users */}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-400 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      <ItemEdit
        close={close}
        opened={opened}
        initialData={activeItem}
        itemId={activeItem.itemId}
      ></ItemEdit>
      <ItemForm
        opened={openCreateForm}
        close={() => setOpenCreateForm(false)}
        onSubmit={(itemDetails) => {
          onSubmitItem(itemDetails);
        }}
      ></ItemForm>
    </div>
  );
};

export default PackagesAndServices;
