
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, X, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface TagManagementProps {
  availableTags: Tag[];
  onTagsUpdate: (tags: Tag[]) => void;
}

const TagManagement = ({ availableTags, onTagsUpdate }: TagManagementProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3B82F6');
  const { toast } = useToast();

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  const handleSubmit = () => {
    if (!tagName.trim()) return;

    if (editingTag) {
      const updatedTags = availableTags.map(tag =>
        tag.id === editingTag.id 
          ? { ...tag, name: tagName, color: tagColor }
          : tag
      );
      onTagsUpdate(updatedTags);
      toast({ title: "Success", description: "Tag updated successfully" });
    } else {
      const newTag: Tag = {
        id: Math.max(...availableTags.map(t => t.id), 0) + 1,
        name: tagName,
        color: tagColor
      };
      onTagsUpdate([...availableTags, newTag]);
      toast({ title: "Success", description: "Tag created successfully" });
    }

    resetForm();
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setTagColor(tag.color);
    setIsDialogOpen(true);
  };

  const handleDelete = (tagId: number) => {
    const updatedTags = availableTags.filter(tag => tag.id !== tagId);
    onTagsUpdate(updatedTags);
    toast({ title: "Success", description: "Tag deleted successfully" });
  };

  const resetForm = () => {
    setTagName('');
    setTagColor('#3B82F6');
    setEditingTag(null);
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tag Management</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-forest-600 hover:bg-forest-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? 'Edit' : 'Create'} Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tagName">Tag Name</Label>
                <Input
                  id="tagName"
                  value={tagName}
                  onChange={(e) => setTagName(e.target.value)}
                  placeholder="Enter tag name"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        tagColor === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setTagColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-forest-600 hover:bg-forest-700">
                  {editingTag ? 'Update' : 'Create'} Tag
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <div key={tag.id} className="flex items-center">
              <Badge 
                style={{ backgroundColor: tag.color, color: 'white' }}
                className="mr-1"
              >
                {tag.name}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleEdit(tag)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-600"
                onClick={() => handleDelete(tag.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {availableTags.length === 0 && (
            <p className="text-gray-500">No tags created yet. Click "Add Tag" to create your first tag.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagManagement;
