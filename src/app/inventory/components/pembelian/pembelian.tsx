import { getAllDataPembelian } from "@/api/pembelian"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import formatRupiah from "@/reusable/formatRupiah"
import { Dialog } from "primereact/dialog"
import Image from "next/image"
import { FormDataPembelian } from "./utils/formData"
import DialogDelete from "./utils/dialogDelete"
import Pagination from "@/reusable/pagination"
import toast from "react-hot-toast"

type TPembelianData = {
  kode: string
  jenis: string
  tgl_beli: string
  harga_beli: string
  supplier: string
  serial_number: string
  keterangan: string
  nota: string
}

type TUsers = {
  exp: number
  lat: number
  role: string
  username: string
}

export default function Pembelian() {
  const queryClient = useQueryClient()

  // form data dialog state
  const [visibleFormData, setVisibleFormData] = useState<boolean>(false)

  // image dialog state
  const [visibleImageDialog, setVisibleImageDialog] = useState<boolean>(false)

  // delete dialog state
  const [visibleDialogDelete, setVisibleDialogDelete] = useState<boolean>(false)

  //
  const [selectedData, setSelectedData] = useState<TPembelianData>()

  // temp image, preview temp
  const [tempImg, setTempImg] = useState<string[]>([])

  //
  const [flagEdit, setFlagEdit] = useState<boolean>(false)

  //
  const [keywordDataLength, setKeywordDataLength] = useState(0)

  // keyword searching
  const [keyword, setKeyword] = useState<string>("")

  //
  const [tableData, setTableData] = useState<TPembelianData[]>([])

  // temp form create
  const [tempFormData, setTempFormData] = useState<TPembelianData>({
    kode: "",
    jenis: "",
    tgl_beli: "",
    harga_beli: "",
    supplier: "",
    serial_number: "",
    keterangan: "",
    nota: "",
  })

  // pagination state
  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  // query
  const pembelianData: TPembelianData[] | undefined = queryClient.getQueryData([
    "pembelian",
  ])

  // Queries
  useQuery({
    queryKey: ["pembelian"],
    queryFn: getAllDataPembelian,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

  // form data header
  const headerFormData = (
    <div className="flex align-items-center">
      New Pembelian
      <Image
        src="https://erp.sampurna-group.com/assets/layout/images/logo-white.png"
        alt="ASM Logo"
        width={30}
        height={30}
        className="ml-2"
      />
    </div>
  )

  const handleBtnEdit = () => {
    toast("Under Development", {
      icon: "⚠️",
    })
  }

  // handle delete btn
  const handleDeleteColumn = (e: TPembelianData) => {
    setSelectedData(e)
    setVisibleDialogDelete(true)
  }

  useEffect(() => {
    if (pembelianData) {
      if (keyword) {
        const keywordData = pembelianData?.filter((e) =>
          Object.values(e)
            .join("|")
            .toLowerCase()
            .includes(keyword.toLowerCase())
        )

        setTableData(
          keywordData.slice(first, first === 0 ? rows : rows * (first + 1))
        )

        setKeywordDataLength(keywordData.length)
      } else {
        const tempTableData = pembelianData?.slice(
          first,
          first === 0 ? rows : rows * (first + 1)
        )
        setTableData(tempTableData)
        setKeywordDataLength(pembelianData.length)
      }
    }
  }, [first, rows, pembelianData, keyword])

  const columnTable = [
    { field: "kode", header: "Kode" },
    { field: "jenis", header: "Jenis" },
    { field: "tgl_beli", header: "Tgl Beli" },
    { field: "harga_beli", header: "Harga Beli" },
    { field: "supplier", header: "Supplier" },
    { field: "serial_number", header: "Serial Number" },
    { field: "keterangan", header: "Keterangan" },
    { field: "nota", header: "Nota" },
  ]

  return (
    <div className="px-3 py-1">
      <div className="flex justify-content-between">
        <div className="flex align-items-center" style={{ width: "20%" }}>
          <div className="text-2xl font-semibold flex align-items-center">
            Pembelian
          </div>
          <i
            className="pi pi-shopping-cart pt-1 ml-2"
            style={{ fontSize: "1.3rem" }}
          ></i>
        </div>
        <div>
          <Pagination
            dataLength={keywordDataLength}
            first={first}
            rows={rows}
            setFirst={setFirst}
            setRows={setRows}
          />
        </div>
        <div
          className="flex align-items-center justify-content-end"
          style={{ width: "20%" }}
        >
          <Button
            icon="pi pi-plus"
            size="small"
            tooltip="Tambah Pembelian"
            className="mr-2"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => setVisibleFormData(true)}
          />
          <InputText
            className="p-inputtext-sm"
            placeholder="search keyword"
            value={keyword}
            onChange={(e: any) => setKeyword(e?.target?.value)}
          />
        </div>
      </div>
      {tableData ? (
        <div className="mt-2" style={{ height: "calc(100vh - 18rem)" }}>
          <DataTable
            value={tableData}
            removableSort
            scrollable
            scrollHeight="flex"
          >
            <Column
              key={"column-table"}
              header="No"
              body={(_, rowIndex) => <>{rowIndex.rowIndex + 1}</>}
            />
            {columnTable?.map(({ field, header }) => (
              <Column
                key={"column-table"}
                style={{ width: "15%" }}
                field={field}
                header={header}
                sortable
                body={(e) => {
                  if (field === "harga_beli") {
                    return <>{formatRupiah(e[`${field}`])}</>
                  } else if (field === "nota") {
                    return (
                      <Button
                        style={{ fontSize: "12px", padding: "0" }}
                        label={"view image"}
                        link
                        onClick={() => {
                          setTempImg(e.nota.split("|"))
                          setVisibleImageDialog(true)
                          // setTempImg(e.nota.split("|")[0])
                        }}
                      />
                    )
                  } else {
                    return <>{e[`${field}`]}</>
                  }
                }}
              />
            ))}
            <Column
              key={"column-table"}
              body={(e) => (
                <Button
                  size="small"
                  icon="pi pi-pencil"
                  text
                  severity="info"
                  onClick={handleBtnEdit}
                />
              )}
            />
            <Column
              key={"column-table"}
              body={(e) => (
                <Button
                  size="small"
                  icon="pi pi-trash"
                  text
                  severity="danger"
                  onClick={() => handleDeleteColumn(e)}
                />
              )}
            />
          </DataTable>
        </div>
      ) : (
        <></>
      )}
      <Dialog
        header={headerFormData}
        visible={visibleFormData}
        onHide={() => {
          setVisibleFormData(false)
        }}
      >
        <FormDataPembelian
          setVisible={setVisibleFormData}
          tempFormData={tempFormData}
          flagEdit={flagEdit}
        />
      </Dialog>
      <Dialog
        header="Image View"
        visible={visibleImageDialog}
        onHide={() => setVisibleImageDialog(false)}
      >
        <div
          className="flex align-items-center relative flex-col overflow-auto"
          style={{ height: "500px", width: "700px", gap: "10px" }}
        >
          {tempImg?.map((e: string, i: number) => (
            <img
              key={i}
              alt={"img-viewer"}
              src={`https://firebasestorage.googleapis.com/v0/b/fir-upload-b7a9b.appspot.com/o/images%2F${
                e.split("/")[1]
              }?alt=media&token=1ab24b2b-2ecb-4ec3-ba6e-b21fe5178acb`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          ))}
        </div>
      </Dialog>
      {/* delete dialog  */}
      <Dialog
        header="Delete!"
        visible={visibleDialogDelete}
        onHide={() => setVisibleDialogDelete(false)}
      >
        <DialogDelete
          setVisible={setVisibleDialogDelete}
          selectedData={selectedData}
        />
      </Dialog>
    </div>
  )
}
