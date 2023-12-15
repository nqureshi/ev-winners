import { TableHeader, TableCell, TableRow, TableBody, Table } from "@/components/ui/table"

export default function WinnersTable({ data }: { data: any[] }) {
    console.log(data[0]);

    return (
        <Table>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.batch}</TableCell>
                        <TableCell>{item.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}