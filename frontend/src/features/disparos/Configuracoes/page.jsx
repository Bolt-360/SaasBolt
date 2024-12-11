'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import ConfigDisparos from './configDisparos'
import ConfigSGA from './configSGA'

const DisparosConfiguracoes = () => {
  const [activeContent, setActiveContent] = useState('sga')

  return (
    <div className="min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="container mx-auto py-10">
        <div className='mx-auto flex justify-between w-full max-w-4xl'>
          <div className='flex items-center gap-5 justify-center mb-10'>
            <Button className="w-24"
            onClick={() => setActiveContent('sga')}
            variant={activeContent === 'sga' ? 'default' : 'outline'}
            >
              SGA
            </Button>
            <Button className="w-24"
            onClick={() => setActiveContent('disparos')}
            variant={activeContent === 'disparos' ? 'default' : 'outline'}
            >
              Disparos
            </Button>
          </div>
          <div className=''>
            <Button>Como gerar meu token no SGA?</Button>
          </div>
        </div>

        {activeContent === 'sga' ? (
          <ConfigSGA />
          ) : (
            <ConfigDisparos />
          )
        }
      </div>
    </div>
  )
}

export default DisparosConfiguracoes