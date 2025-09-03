<script lang="ts">
	import { onMount } from 'svelte';
	import { Building, Users, Package, Activity, Calendar, TrendingUp } from 'lucide-svelte';
	import { API_BASE } from '$lib/config.js';
	
	let statusData: any[] = [];
	let phases: any[] = [];
	let dailyStats: any = {};
	let selectedDateRange = {
		start: new Date().toISOString().split('T')[0],
		end: new Date().toISOString().split('T')[0]
	};
	
	onMount(async () => {
		await fetchData();
	});
	
	async function fetchData() {
		try {
			// Fetch status board data
			const statusResponse = await fetch(`${API_BASE}/status`);
			statusData = await statusResponse.json();
			
			// Fetch construction phases
			const phasesResponse = await fetch(`${API_BASE}/status/phases`);
			phases = await phasesResponse.json();
			
			// Fetch daily stats
			const statsResponse = await fetch(`${API_BASE}/daily-updates/stats?startDate=${selectedDateRange.start}&endDate=${selectedDateRange.end}`);
			dailyStats = await statsResponse.json();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	}
	
	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'completed': return 'status-completed';
			case 'in_progress': case 'in-progress': return 'status-in-progress';
			case 'not_started': case 'not-started': return 'status-not-started';
			case 'on_hold': case 'on-hold': return 'status-on-hold';
			default: return 'status-not-started';
		}
	}
	
	function formatStatus(status: string) {
		return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
	}
</script>

<svelte:head>
	<title>National Group India - Construction Dashboard</title>
</svelte:head>

<div class="app-container">
	<!-- Sidebar Navigation -->
	<nav class="sidebar">
		<div style="padding: 2rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.2);">
			<h2 style="margin: 0; color: white; font-size: 1.5rem;">🏗️ National Group</h2>
			<p style="margin: 0.5rem 0 0 0; color: rgba(255,255,255,0.8); font-size: 0.9rem;">Construction Management</p>
		</div>
		
		<div style="padding: 1rem 0;">
			<a href="/" class="nav-item active">
				<Activity size={20} style="display: inline; margin-right: 0.75rem;" />
				Status Board
			</a>
			<a href="/labor" class="nav-item">
				<Users size={20} style="display: inline; margin-right: 0.75rem;" />
				Labor Management
			</a>
			<a href="/materials" class="nav-item">
				<Package size={20} style="display: inline; margin-right: 0.75rem;" />
				Materials & P&M
			</a>
			<a href="/daily-updates" class="nav-item">
				<Calendar size={20} style="display: inline; margin-right: 0.75rem;" />
				Daily Updates
			</a>
			<a href="/reports" class="nav-item">
				<TrendingUp size={20} style="display: inline; margin-right: 0.75rem;" />
				Reports
			</a>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="main-content">
		<!-- Header -->
		<div class="header">
			<h1>Construction Status Dashboard</h1>
			<p class="subtitle">Real-time overview of all construction activities • {new Date().toLocaleDateString('en-IN')}</p>
		</div>

		<!-- Dashboard Statistics -->
		<div class="dashboard-grid">
			<div class="stat-card">
				<div class="stat-number">{statusData.length}</div>
				<div class="stat-label">Active Projects</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">{phases.filter(p => p.status === 'IN_PROGRESS').length}</div>
				<div class="stat-label">Phases in Progress</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">{Math.round(dailyStats.avg_manpower || 0)}</div>
				<div class="stat-label">Average Manpower</div>
			</div>
			<div class="stat-card">
				<div class="stat-number">{dailyStats.total_safety_incidents || 0}</div>
				<div class="stat-label">Safety Incidents</div>
			</div>
		</div>

		<!-- Date Range Control -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">📅 Date Range Filter</h3>
			</div>
			<div style="display: flex; gap: 1rem; align-items: end;">
				<div class="form-group" style="margin-bottom: 0;">
					<label class="form-label" for="start-date">Start Date</label>
					<input id="start-date" type="date" class="form-input" bind:value={selectedDateRange.start} on:change={fetchData} />
				</div>
				<div class="form-group" style="margin-bottom: 0;">
					<label class="form-label" for="end-date">End Date</label>
					<input id="end-date" type="date" class="form-input" bind:value={selectedDateRange.end} on:change={fetchData} />
				</div>
				<button class="btn btn-primary" on:click={fetchData}>Update</button>
			</div>
		</div>

		<!-- Project Status Overview -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">🏢 Project Status Board</h3>
				<button class="btn btn-secondary">Add New Project</button>
			</div>
			<div class="table-container">
				<table class="table">
					<thead>
						<tr>
							<th>Project Name</th>
							<th>Phase</th>
							<th>Status</th>
							<th>Progress</th>
							<th>Start Date</th>
							<th>Target Date</th>
						</tr>
					</thead>
					<tbody>
						{#each statusData as project}
							<tr>
								<td style="font-weight: 600;">{project.project_name}</td>
								<td>{project.phase}</td>
								<td>
									<span class="status-badge {getStatusColor(project.status)}">
										{formatStatus(project.status)}
									</span>
								</td>
								<td>
									<div class="progress-bar">
										<div class="progress-fill" style="width: {project.progress}%"></div>
									</div>
									<small>{project.progress}%</small>
								</td>
								<td>{project.start_date || 'Not set'}</td>
								<td>{project.end_date || 'Not set'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Construction Phases -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">🔧 Construction Phases Status</h3>
			</div>
			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
				{#each phases as phase}
					<div class="card" style="margin-bottom: 0; border-left: 4px solid var(--primary-gold);">
						<div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
							<div>
								<h4 style="margin: 0; color: var(--text-dark);">{phase.phase_name}</h4>
								<p style="margin: 0.25rem 0; color: var(--text-light); font-size: 0.9rem;">{phase.category}</p>
							</div>
							<span class="status-badge {getStatusColor(phase.status)}">
								{formatStatus(phase.status)}
							</span>
						</div>
						<div class="progress-bar">
							<div class="progress-fill" style="width: {phase.progress}%"></div>
						</div>
						<div style="display: flex; justify-content: between; margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);">
							<span>{phase.progress}%</span>
							<span>{phase.responsible_person}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">⚡ Quick Actions</h3>
			</div>
			<div style="display: flex; gap: 1rem; flex-wrap: wrap;">
				<button class="btn btn-primary">📝 Add Daily Update</button>
				<button class="btn btn-secondary">👷 Manage Labor</button>
				<button class="btn btn-secondary">📦 Material Request</button>
				<button class="btn btn-secondary">🚨 Report Issue</button>
				<button class="btn btn-secondary">📊 Generate Report</button>
			</div>
		</div>
	</main>
</div>

<style>
	.table-container {
		overflow-x: auto;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
	}
</style>
