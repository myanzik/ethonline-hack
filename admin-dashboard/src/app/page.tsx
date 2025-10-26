'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMerchants, getBeneficiaries, getChannels } from '@/utils/dataUtils';
import { Users, UserCheck, Network, Plus, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const merchants = getMerchants();
  const beneficiaries = getBeneficiaries();
  const channels = getChannels();

  const activeMerchants = merchants.filter(m => m.isActive).length;
  const activeBeneficiaries = beneficiaries.filter(b => b.isActive).length;
  const activeChannels = channels.filter(c => c.isActive).length;
  const totalTokensDistributed = channels.reduce((sum, channel) => sum + channel.totalTokensDistributed, 0);

  const stats = [
    {
      title: 'Total Merchants',
      value: merchants.length,
      active: activeMerchants,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Beneficiaries',
      value: beneficiaries.length,
      active: activeBeneficiaries,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Channels',
      value: channels.length,
      active: activeChannels,
      icon: Network,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Tokens Distributed',
      value: totalTokensDistributed.toLocaleString(),
      active: null,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ];

  const recentChannels = channels.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to the Admin Dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.active !== null && (
                      <p className="text-xs text-green-600">
                        {stat.active} active
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/channels/create">
                <Button className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Channel
                </Button>
              </Link>
              <Link href="/merchants">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View All Merchants
                </Button>
              </Link>
              <Link href="/beneficiaries">
                <Button variant="outline" className="w-full justify-start">
                  <UserCheck className="w-4 h-4 mr-2" />
                  View All Beneficiaries
                </Button>
              </Link>
              <Link href="/channels">
                <Button variant="outline" className="w-full justify-start">
                  <Network className="w-4 h-4 mr-2" />
                  View All Channels
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Channels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Channels
                <Link href="/channels">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentChannels.length > 0 ? (
                <div className="space-y-4">
                  {recentChannels.map((channel) => (
                    <div key={channel.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{channel.name}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${channel.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {channel.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{channel.merchants.length} merchants</span>
                        <span>{channel.beneficiaries.length} beneficiaries</span>
                        <span>${channel.totalTokensDistributed.toLocaleString()} tokens</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No channels created yet</p>
                  <Link href="/channels/create">
                    <Button variant="outline" size="sm" className="mt-2">
                      Create Your First Channel
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {((activeMerchants / merchants.length) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Merchant Activation Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {((activeBeneficiaries / beneficiaries.length) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Beneficiary Activation Rate</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {channels.length > 0 ? (totalTokensDistributed / channels.length).toLocaleString() : 0}
                </div>
                <p className="text-sm text-gray-600">Avg Tokens per Channel</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}