TOTAL_NUMBER_OF_DOCS = 0
TOTAL_NUMBER_OF_TOKEN = 0


def merge(head1, head2):
    if head1 is None and head1 is None:
        return None
    ans_head = Node(-1)
    tmp = ans_head
    while head1 is not None and head2 is not None:
        if head1.tf_idf_score > head2.tf_idf_score:
            tmp.next = head1
            head1 = head1.next
        else:
            tmp.next = head2
            head2 = head2.next
        tmp = tmp.next
    if head1 is not None:
        tmp.next = head1
    if head2 is not None:
        tmp.next = head2
    return ans_head.next


def merge_sort(first_head):
    if first_head is None or first_head.next is None:
        return first_head
    mid_node = mid(first_head)
    second_head = mid_node.next
    mid_node.next = None
    first_head = merge_sort(first_head)
    second_head = merge_sort(second_head)
    return merge(first_head, second_head)


def mid(head):
    if head is None or head.next is None:
        return None

    fp = head
    sp = head
    tmp = head
    while fp is not None and fp.next is not None:
        tmp = sp
        fp = fp.next.next
        sp = sp.next

    return tmp


class Node:
    def __init__(self, data, next=None, skip_pointer=None):
        self.next = next
        self.data = data
        self.token_frequency_in_doc = 0
        self.tf_idf_score = 0
        self.skip_pointer = skip_pointer


class LinkedList:
    def __init__(self, head):
        self.head = head
        self.posting_list_length = 0

    def print(self):
        node = self.head
        while node is not None:
            print(node.data, end=',\n')
            node = node.next

    def merge_without_skip(self, head2):
        num_of_comp = 0
        num_of_elem = 0
        i = self.head
        j = head2
        ans_head = Node(0)
        tmp = ans_head
        while i is not None and j is not None:
            if i.data == j.data:
                tmp.next = Node(i.data)
                tmp = tmp.next
                tmp.tf_idf_score = max(i.tf_idf_score,j.tf_idf_score)
                num_of_elem += 1
                i = i.next
                j = j.next
            elif i.data < j.data:
                i = i.next
            else:
                j = j.next
            num_of_comp += 1
        return [ans_head.next, num_of_comp, num_of_elem]

    def merge_with_skip(self, head2):
        num_of_comp = 0
        num_of_elem = 0
        i = self.head
        j = head2
        ans_head = Node(0)
        tmp = ans_head
        while i is not None and j is not None:
            if i.data == j.data:
                tmp.next = Node(i.data)
                tmp = tmp.next
                tmp.tf_idf_score = max(i.tf_idf_score, j.tf_idf_score)
                num_of_elem += 1
                i = i.next
                j = j.next
            elif i.data < j.data:
                if i.skip_pointer is not None:
                    if i.skip_pointer.data <= j.data:
                        i = i.skip_pointer
                        num_of_comp += 1
                    else:
                        i = i.next
                else:
                    i = i.next
            else:
                if j.skip_pointer is not None:
                    if j.skip_pointer.data <= i.data:
                        j = j.skip_pointer
                        num_of_comp += 1
                    else:
                        j = j.next
                else:
                    j = j.next
            num_of_comp += 1
        return [ans_head.next, num_of_comp, num_of_elem]


def convert_linked_list_to_list(head):
    ans = list()
    tmp = head
    while tmp is not None:
        ans.append(tmp.data)
        tmp = tmp.next
    return ans


def convert_linked_list_to_skip_list(head):
    ans = list()
    tmp = head
    while tmp is not None:
        ans.append(tmp.data)
        tmp = tmp.skip_pointer
    return ans
