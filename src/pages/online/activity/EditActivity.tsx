import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { withDashboard } from '@/hoc/withDashboard';
import { useParams } from 'react-router-dom';

const EditActivity = withDashboard(() => {
  const { id } = useParams();

  // In a real application, you would fetch activity data using the id
  const activity = {
    id: id, // This would come from fetched data
    title: `Activity ${id} Title`,
    description: `Activity ${id} Description`,
    status: 'Draft',
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Edit Activity {id}</h1>
      <form className='space-y-4'>
        <div>
          <Label htmlFor='title'>Title</Label>
          <Input
            id='title'
            placeholder='Activity Title'
            defaultValue={activity.title}
          />
        </div>
        <div>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            placeholder='Activity Description'
            defaultValue={activity.description}
          />
        </div>
        <Button type='submit'>Save Changes</Button>
      </form>
    </div>
  );
});

export default EditActivity;
