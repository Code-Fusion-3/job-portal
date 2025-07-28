import StatCard from './StatCard';

const StatsGrid = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </div>
  );
};

export default StatsGrid; 