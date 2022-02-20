import React from 'react'

import { Card, CardBody } from '@roketid/windmill-react-ui'
import PageTitle from 'example/components/Typography/PageTitle'
import SectionTitle from 'example/components/Typography/SectionTitle'
import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon, StarIcon } from 'icons'

function Cards() {
  return (
    <Layout>
      <PageTitle>Cards</PageTitle>

      <CTA icon={StarIcon} message='Star this project on GitHub' url='https://github.com/roketid/windmill-nextjs-laravel-breeze' />

      <SectionTitle>Big section cards</SectionTitle>

      <Card className="mb-8 shadow-md">
        <CardBody>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Large, full width sections goes here
          </p>
        </CardBody>
      </Card>

      <SectionTitle>Responsive cards</SectionTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total clients" value="6389">
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Account balance" value="$ 46,760.89">
        {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="New sales" value="376">
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending contacts" value="35">
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <SectionTitle>Cards with title</SectionTitle>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Revenue</p>
            <p className="text-gray-600 dark:text-gray-400">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis
              numquam quod? Totam exercitationem quos hic ipsam at qui cum numquam, sed amet
              ratione! Ratione, nihil dolorum.
            </p>
          </CardBody>
        </Card>

        <Card colored className="text-white bg-purple-600">
          <CardBody>
            <p className="mb-4 font-semibold">Colored card</p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga, cum commodi a omnis
              numquam quod? Totam exercitationem quos hic ipsam at qui cum numquam, sed amet
              ratione! Ratione, nihil dolorum.
            </p>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}

export default Cards
