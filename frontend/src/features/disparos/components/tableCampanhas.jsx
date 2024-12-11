import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const campaigns = [
  {
    name: "Disparo Avulso",
    entregues: "233",
    status: "Ativa",
    falhas: "10",
  },
  {
    name: "2 Dias Antes",
    entregues: "350",
    status: "Concluída",
    falhas: "11",
  },
  {
    name: "5 Dias Após",
    entregues: "51",
    status: "Concluída",
    falhas: "8",
  },
  {
    name: "Extrajudicial",
    entregues: "12",
    status: "Concluída",
    falhas: "0",
  },
]

export function CampaignTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="text-green-500">Entregues</TableHead>
          <TableHead className="text-red-500">Falhas</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow key={campaign.name}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell className="">{campaign.entregues}</TableCell>
            <TableCell>{campaign.falhas}</TableCell>
            <TableCell>
              <Badge
                variant={
                  campaign.status === "Ativa"
                    ? "default"
                    : campaign.status !== "Ativa"
                    ? "secondary"
                    : "outline"
                }
              >
                {campaign.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

