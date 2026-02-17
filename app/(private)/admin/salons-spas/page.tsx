import { Button } from '@/components/ui/button'
import PageTitle from '@/components/ui/page-title'
import Link from 'next/link'
import React from 'react'

function SalonsSpasList() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Salons & Spas" />
        <Button>
          <Link href="/admin/salon-spas/add">Add Salon</Link>
        </Button>
      </div>
    </div>
  )
}

export default SalonsSpasList