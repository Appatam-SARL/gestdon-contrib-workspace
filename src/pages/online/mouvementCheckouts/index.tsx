import { withDashboard } from "@/hoc/withDashboard"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useGetMouvementCheckouts } from "@/hook/mouvement-checkout.hook"
import useContributorStore from "@/store/contributor.store"
import { IMouvementCheckout } from "@/interface/activity"
import { Calendar1Icon, Eye, FileUp, FileText, RefreshCw, TrendingDown, TrendingUp, Sheet } from "lucide-react"
import imgArrayEmpty from "@/assets/img/activityempty.png"
import Skeleton from "react-loading-skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { exportToPDF } from "@/utils/exportToPdf"
import { exportToExcel } from "@/utils/exportExcel"

type PeriodPreset = 'day' | 'week' | 'month' | 'year' | 'custom'
type TypeFilter = 'all' | 'expense' | 'income'

const MouvementCheckoutsPage = () => {
  const contributorId = useContributorStore(s => s.contributor?._id) as string

  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('month')
  const [customFrom, setCustomFrom] = useState<string>('')
  const [customTo, setCustomTo] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selected, setSelected] = useState<IMouvementCheckout | null>(null)

  const { data, isLoading, isError, error, refetch, isFetching, isRefetching } = useGetMouvementCheckouts({ contributorId })
  const LottiePlayer = 'lottie-player' as any

  useEffect(() => {
    if (periodPreset !== 'custom') {
      setCustomFrom('')
      setCustomTo('')
    }
  }, [periodPreset])

  const { filtered, totals } = useMemo(() => {
    const list: IMouvementCheckout[] = data?.data || []

    // Compute date range
    const now = new Date()
    let start: Date | null = null
    let end: Date | null = null
    if (periodPreset === 'day') {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    } else if (periodPreset === 'week') {
      const day = now.getDay() || 7 // Monday-based week
      const monday = new Date(now)
      monday.setDate(now.getDate() - (day - 1))
      monday.setHours(0, 0, 0, 0)
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      sunday.setHours(23, 59, 59, 999)
      start = monday
      end = sunday
    } else if (periodPreset === 'month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    } else if (periodPreset === 'year') {
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0)
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
    } else if (periodPreset === 'custom') {
      if (customFrom) start = new Date(customFrom + 'T00:00:00')
      if (customTo) end = new Date(customTo + 'T23:59:59')
    }

    const fitsDate = (d: string) => {
      const created = new Date(d)
      if (start && created < start) return false
      if (end && created > end) return false
      return true
    }

    const isIncome = (m: IMouvementCheckout) => {
      const label = typeof m.typeMouvementCheckout === 'object' ? m.typeMouvementCheckout.name : m.typeMouvementCheckout
      return (label || '').toLowerCase().includes('recette') || (label || '').toLowerCase().includes('income')
    }
    const isExpense = (m: IMouvementCheckout) => !isIncome(m)

    const afterDate = list.filter(m => fitsDate(m.createdAt))
    const afterType = afterDate.filter(m => {
      if (typeFilter === 'all') return true
      if (typeFilter === 'income') return isIncome(m)
      if (typeFilter === 'expense') return isExpense(m)
      return true
    })

    const totalIncomes = afterType.filter(isIncome).reduce((sum, m) => sum + (m.amount || 0), 0)
    const totalExpenses = afterType.filter(isExpense).reduce((sum, m) => sum + (m.amount || 0), 0)
    const balance = totalIncomes - totalExpenses

    return {
      filtered: afterType,
      totals: { totalIncomes, totalExpenses, balance }
    }
  }, [data, periodPreset, customFrom, customTo, typeFilter])

  const dataToExport = filtered.map((item: IMouvementCheckout) => ({
    type: typeof item.typeMouvementCheckout === 'object' ? item.typeMouvementCheckout.name : item.typeMouvementCheckout,
    category: typeof item.categoryMouvementCheckout === 'object' ? item.categoryMouvementCheckout.name : item.categoryMouvementCheckout,
    activity: typeof item.activityId === 'object' ? item.activityId.title : item.activityId,
    amount: item.amount,
    createdAt: item.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Mouvements de caisse</h2>
          <p className="text-muted-foreground">Liste, statistiques et filtres</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" /> Recettes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{totals.totalIncomes?.toLocaleString('fr-FR') || 0} FCFA</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <TrendingDown className="h-5 w-5" /> Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{totals.totalExpenses?.toLocaleString('fr-FR') || 0} FCFA</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Solde net
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-purple-900' : 'text-red-900'}`}>{totals.balance?.toLocaleString('fr-FR') || 0} FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Période:</span>
              <Button variant={periodPreset === 'day' ? 'default' : 'outline'} size="sm" onClick={() => setPeriodPreset('day')}>Jour</Button>
              <Button variant={periodPreset === 'week' ? 'default' : 'outline'} size="sm" onClick={() => setPeriodPreset('week')}>Semaine</Button>
              <Button variant={periodPreset === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setPeriodPreset('month')}>Mois</Button>
              <Button variant={periodPreset === 'year' ? 'default' : 'outline'} size="sm" onClick={() => setPeriodPreset('year')}>Année</Button>
              <Button variant={periodPreset === 'custom' ? 'default' : 'outline'} size="sm" onClick={() => setPeriodPreset('custom')}>Personnalisée</Button>
            </div>
            {periodPreset === 'custom' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Calendar1Icon className="h-4 w-4" />
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                  <span className="text-sm">au</span>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)} className="border rounded px-2 py-1 text-sm" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Type:</span>
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value as TypeFilter)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">Tous</option>
                <option value="income">Recette</option>
                <option value="expense">Dépense</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end gap-4'>
        <Button 
          variant='outline' 
          onClick={() => refetch()} 
          disabled={isFetching} className='gap-2'
        >
          <RefreshCw className='h-4 w-4' /> Actualiser
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            disabled={isFetching || isRefetching || isLoading}
            className='flex items-center gap-2 bg-white border rounded-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'>
            <FileUp className='h-4 w-4 mr-2' />
            <span className="font-semibold">Exporter</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Choisir un format</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => exportToPDF({ data: dataToExport, fileName: 'finances', watermark: 'Contrib finance' })}
            >
              <FileText className='h-4 w-4 mr-2' />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={()=>exportToExcel({ data:dataToExport, fileName:'finances' })}>
              <Sheet className='h-4 w-4 mr-2' />
              EXCEL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Liste */}
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isRefetching ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell><Skeleton height={16} /></TableCell>
                    <TableCell><Skeleton height={16} /></TableCell>
                    <TableCell><Skeleton height={16} width={120} /></TableCell>
                    <TableCell><Skeleton height={16} width={180} /></TableCell>
                    <TableCell className="text-right"><Skeleton height={32} width={72} /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8">
                    <div className="text-red-600 text-center">Erreur: {error?.message || 'Impossible de charger les mouvements.'}</div>
                  </TableCell>
                </TableRow>
              ) : filtered && filtered.length > 0 ? (
                filtered.map(m => (
                  <TableRow key={m._id}>
                    <TableCell className="font-medium">
                      {typeof m.typeMouvementCheckout === 'object' ? m.typeMouvementCheckout.name : m.typeMouvementCheckout}
                    </TableCell>
                    <TableCell>
                      {typeof m.categoryMouvementCheckout === 'object' ? m.categoryMouvementCheckout.name : m.categoryMouvementCheckout}
                    </TableCell>
                    <TableCell className="font-semibold">{m.amount?.toLocaleString('fr-FR')} FCFA</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString('fr-FR', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelected(m)}>
                        <Eye className="h-4 w-4" /> Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8">
                    <div className='flex flex-col items-center justify-center'>
                      <img src={imgArrayEmpty} alt='Aucun mouvement' className='w-1/4 h-1/2 mb-4' />
                      <p className='text-gray-500 text-center'>Aucun mouvement trouvé pour les critères sélectionnés.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>


      {/* Modal détails */}
      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Détails du mouvement</span>
              {selected && (
                <Badge variant={
                  (() => {
                    const label = typeof selected.typeMouvementCheckout === 'object' ? selected.typeMouvementCheckout.name : selected.typeMouvementCheckout;
                    return (label || '').toLowerCase().includes('recette') ? 'success' : 'destructive';
                  })()
                }>
                  {(() => {
                    const label = typeof selected.typeMouvementCheckout === 'object' ? selected.typeMouvementCheckout.name : selected.typeMouvementCheckout;
                    return (label || '').toLowerCase().includes('recette') ? 'Recette' : 'Dépense';
                  })()}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="text-sm font-medium">
                    {typeof selected.typeMouvementCheckout === 'object' ? selected.typeMouvementCheckout.name : selected.typeMouvementCheckout}
                  </div>
                  <div className="text-sm text-muted-foreground">Catégorie</div>
                  <div className="text-sm font-medium">
                    {typeof selected.categoryMouvementCheckout === 'object' ? selected.categoryMouvementCheckout.name : selected.categoryMouvementCheckout}
                  </div>
                  <div className="text-sm text-muted-foreground">Montant</div>
                  <div className="text-sm font-medium">{selected.amount?.toLocaleString('fr-FR')} FCFA</div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="text-sm font-medium">
                    {new Date(selected.createdAt).toLocaleString('fr-FR')}
                  </div>
                </div>
                {selected.description && (
                  <div className="p-3 rounded-md bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-1">Description</div>
                    <div className="text-sm leading-relaxed">{selected.description}</div>
                  </div>
                )}
                {selected.document && selected.document.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Pièces jointes</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {selected.document.map((d, idx) => (
                        <li key={d.fileId || idx} className="text-sm">
                          <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{d.type || 'Document'}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center">
                {/* Lottie illustration */}
                <LottiePlayer
                  autoplay
                  loop
                  mode="normal"
                  src="https://assets1.lottiefiles.com/packages/lf20_bdlrkrqv.json"
                  style={{ width: '220px', height: '220px' }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default withDashboard(MouvementCheckoutsPage)