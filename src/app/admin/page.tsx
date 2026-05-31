import Project from '@/models/Project';
import Lead from '@/models/Lead';
import Service from '@/models/Service';
import Testimonial from '@/models/Testimonial';
import Faq from '@/models/Faq';
import ChatSession from '@/models/ChatSession';
import { tryDbConnect } from '@/lib/db';

export default async function AdminDashboard() {
  const db = await tryDbConnect();

  if (!db) {
    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <h3 className="text-xl font-bold mb-4">Dashboard unavailable</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            The database connection could not be established, so stats are temporarily unavailable.
          </p>
        </div>
      </div>
    );
  }

  const [
    totalProjects,
    featuredProjects,
    totalServices,
    totalTestimonials,
    totalFaqs,
    newLeads,
    contactedLeads,
    wonLeads,
    lostLeads,
    recentLeads,
    activeChats,
  ] = await Promise.all([
    Project.countDocuments().lean(),
    Project.countDocuments({ featured: true }).lean(),
    Service.countDocuments().lean(),
    Testimonial.countDocuments().lean(),
    Faq.countDocuments().lean(),
    Lead.countDocuments({ status: 'new' }).lean(),
    Lead.countDocuments({ status: 'contacted' }).lean(),
    Lead.countDocuments({ status: 'won' }).lean(),
    Lead.countDocuments({ status: 'lost' }).lean(),
    Lead.find().sort({ createdAt: -1 }).limit(3).lean(),
    ChatSession.countDocuments({ status: 'active', unreadCount: { $gt: 0 } }).lean(),
  ]);

  const totalLeads = newLeads + contactedLeads + wonLeads + lostLeads;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={totalProjects} />
        <StatCard title="Featured" value={featuredProjects} />
        <StatCard title="Services" value={totalServices} />
        <StatCard title="Testimonials" value={totalTestimonials} />
        <StatCard title="FAQs" value={totalFaqs} />
        <StatCard title="New Leads" value={newLeads} color="text-blue-600" />
        <StatCard title="Won" value={wonLeads} color="text-green-600" />
        <StatCard title="Total Leads" value={totalLeads} />
        <StatCard title="Unread Chats" value={activeChats} color={activeChats > 0 ? 'text-orange-600' : 'text-neutral-500'} />
      </div>

      {/* Leads Breakdown */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xs font-semibold uppercase text-neutral-500 mb-4 tracking-wider">Leads Breakdown</h3>
        <div className="flex gap-8 flex-wrap">
          <LeadBadge label="New" count={newLeads} cls="bg-blue-100 text-blue-700" />
          <LeadBadge label="Contacted" count={contactedLeads} cls="bg-yellow-100 text-yellow-700" />
          <LeadBadge label="Won" count={wonLeads} cls="bg-green-100 text-green-700" />
          <LeadBadge label="Lost" count={lostLeads} cls="bg-neutral-100 text-neutral-600" />
        </div>
      </div>

      {/* Recent Leads */}
      {recentLeads.length > 0 && (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-semibold uppercase text-neutral-500 tracking-wider">Recent Leads</h3>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {recentLeads.map((lead: any) => (
                <tr key={lead._id.toString()}>
                  <td className="px-6 py-3 font-medium">{lead.name}</td>
                  <td className="px-6 py-3 text-neutral-500">{lead.email}</td>
                  <td className="px-6 py-3 text-xs uppercase font-bold">{lead.package || 'Custom'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      lead.status === 'won' ? 'bg-green-100 text-green-700' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>{lead.status}</span>
                  </td>
                  <td className="px-6 py-3 text-neutral-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800">
        <h3 className="text-xl font-bold mb-4">Welcome, Amir</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Use the sidebar to manage your portfolio content and view incoming leads.
        </p>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  color?: string;
}

function StatCard({ title, value, color = 'text-black dark:text-white' }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <h4 className="text-sm font-medium text-neutral-500 mb-1">{title}</h4>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function LeadBadge({ label, count, cls }: { label: string; count: number; cls: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${cls}`}>{label}</span>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );
}
