import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ClassDetails } from '@/types';
import { useShow } from '@refinedev/core';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { bannerPhoto } from '@/lib/cloudinary';


const Show = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' });
    const { data, isLoading, isError } = query;
    const classDetails = data?.data;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource='classes' title="Class Details" />
                <p className='state-message'>
                    {
                        isLoading ? 'Loading...' :
                            isError ? 'Error loading class details' :
                                'No class details found'
                    }
                </p>
            </ShowView>
        );
    }

    const teacherName = classDetails.teacher?.name || 'Unknown Teacher';
    const teacherInitials = teacherName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teacherInitials || 'NA')}`;

    const {
        name,
        description,
        status,
        capacity,
        bannerUrl,
        subject,
        teacher,
        department,
    } = classDetails;

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource='classes' title="Class Details" />
            <div className='banner'>
                {bannerUrl ? (
                    <img src={bannerPhoto(bannerUrl, subject?.name ?? '')} alt="Class Banner" />
                ) : (
                    <div className="placeholder-banner">
                        <p>{teacherInitials}</p>
                    </div>
                )}
            </div>
            <Card className='details-card'>
                <div className='details-header'>
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>
                    <Badge variant="outline">
                        {capacity} spots
                    </Badge>
                    <Badge variant={status === 'active' ? 'default' : 'secondary'} data-status={status}>
                        {status.toUpperCase()}
                    </Badge>
                </div>

                <div className='flex details-grid'>
                    <div className='instructor'>
                        <p>Instructor</p>
                        <div>
                            <img src={teacher?.image || placeholderUrl} alt={teacherName} />
                        </div>
                        <div>
                            <p>{teacher?.name}</p>
                            <p>{teacher?.email}</p>
                        </div>
                    </div>
                    <div className='department'>
                        <div>
                            <p>{department?.name}</p>
                            <p>{department?.description}</p>
                        </div>
                    </div>
                </div>

                <Separator />
                <div className='subject'>
                    <p>Subject</p>
                    <div>
                        <Badge variant="outline">
                            {subject?.code}
                        </Badge>
                        <p>{subject?.name}</p>
                        <p>{subject?.description}</p>
                        <p>{subject?.department}</p>
                    </div>
                </div>
                <Separator />

                <div className="join">
                    <p>Join Class</p>
                    <ol>
                        <li>Copy invite code</li>
                        <li>Go to classroom</li>
                        <li>Join class</li>
                    </ol>
                </div>
                <Button size="lg" className='w-full'>
                    Join Class
                </Button>

            </Card>
        </ShowView>
    );
};

export default Show;