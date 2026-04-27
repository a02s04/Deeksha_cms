import type { Field, GlobalConfig } from 'payload'

const mediaRelationship = (
  name: string,
  label: string,
  adminDescription?: string,
): Field => ({
  name,
  type: 'relationship',
  relationTo: 'media',
  label,
  admin: adminDescription
    ? {
        description: adminDescription,
      }
    : undefined,
})

const sectionHeadingFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
  },
  {
    name: 'heading',
    type: 'text',
  },
  {
    name: 'description',
    type: 'textarea',
  },
]

const testimonialFields: Field[] = [
  {
    name: 'quote',
    type: 'textarea',
    required: true,
  },
  {
    name: 'author',
    type: 'text',
    required: true,
  },
  {
    name: 'rating',
    type: 'number',
    min: 1,
    max: 5,
    defaultValue: 5,
  },
]

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Theme',
          fields: [
            {
              name: 'themeSettings',
              type: 'group',
              fields: [
                {
                  name: 'colorTheme',
                  type: 'select',
                  defaultValue: 'heritage',
                  options: [
                    {
                      label: 'Heritage Walnut',
                      value: 'heritage',
                    },
                    {
                      label: 'Forest Teak',
                      value: 'forest',
                    },
                    {
                      label: 'Charcoal Craft',
                      value: 'charcoal',
                    },
                  ],
                },
                {
                  name: 'fontPairing',
                  type: 'select',
                  defaultValue: 'classic',
                  options: [
                    {
                      label: 'Classic Serif',
                      value: 'classic',
                    },
                    {
                      label: 'Clean Modern',
                      value: 'modern',
                    },
                    {
                      label: 'Editorial',
                      value: 'editorial',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            {
              name: 'homePage',
              type: 'group',
              admin: {
                description:
                  'Controls the static text, images, gallery, video, and process sections on the homepage.',
              },
              fields: [
                {
                  name: 'hero',
                  type: 'group',
                  fields: [
                    {
                      name: 'eyebrow',
                      type: 'text',
                      defaultValue: 'Handcrafted in Rajasthan',
                    },
                    {
                      name: 'titleLine1',
                      type: 'text',
                      defaultValue: 'Furniture',
                    },
                    {
                      name: 'titleLine2',
                      type: 'text',
                      defaultValue: 'built to last',
                    },
                    {
                      name: 'titleLine3',
                      type: 'text',
                      defaultValue: 'generations.',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      defaultValue:
                        'We make solid hardwood furniture by hand - beds, sofas, tables, and more - built exactly to your vision, delivered to your home.',
                    },
                    {
                      name: 'primaryCtaLabel',
                      type: 'text',
                      defaultValue: 'Explore Collections',
                    },
                    {
                      name: 'secondaryCtaLabel',
                      type: 'text',
                      defaultValue: 'View Our Work',
                    },
                    {
                      name: 'statsText',
                      type: 'text',
                      defaultValue: '15+ Years | 2,400+ Pieces | 500+ Happy Homes',
                    },
                    mediaRelationship(
                      'beforeImage',
                      'Hero Before Image',
                      'Used as the first hero/background image.',
                    ),
                    mediaRelationship(
                      'afterImage',
                      'Hero After Image',
                      'Used as the second hero/background image in the reveal animation.',
                    ),
                  ],
                },
                {
                  name: 'gallery',
                  type: 'group',
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'items',
                      type: 'array',
                      labels: {
                        singular: 'Gallery Image',
                        plural: 'Gallery Images',
                      },
                      fields: [
                        mediaRelationship('image', 'Image'),
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'detail',
                          type: 'text',
                        },
                        {
                          name: 'size',
                          type: 'select',
                          defaultValue: 'normal',
                          options: [
                            {
                              label: 'Normal',
                              value: 'normal',
                            },
                            {
                              label: 'Large',
                              value: 'large',
                            },
                            {
                              label: 'Tall',
                              value: 'tall',
                            },
                            {
                              label: 'Wide',
                              value: 'wide',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'portfolio',
                  type: 'group',
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'videoTitle',
                      type: 'text',
                      defaultValue: 'Watch Our Craft',
                    },
                    mediaRelationship('videoFile', 'Video File', 'Upload MP4/WebM videos in Media.'),
                    mediaRelationship('videoPoster', 'Video Poster Image'),
                    {
                      name: 'videoEmbedUrl',
                      type: 'text',
                      admin: {
                        description:
                          'Optional YouTube/Vimeo URL. Used when no video file is selected.',
                      },
                    },
                  ],
                },
                {
                  name: 'whyChooseUs',
                  type: 'group',
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'items',
                      type: 'array',
                      labels: {
                        singular: 'Reason',
                        plural: 'Reasons',
                      },
                      fields: [
                        {
                          name: 'icon',
                          type: 'select',
                          defaultValue: 'wood',
                          options: [
                            { label: 'Wood', value: 'wood' },
                            { label: 'Hands', value: 'hands' },
                            { label: 'Ruler', value: 'ruler' },
                            { label: 'Truck', value: 'truck' },
                            { label: 'Leaf', value: 'leaf' },
                            { label: 'Chat', value: 'chat' },
                          ],
                        },
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'body',
                          type: 'textarea',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'about',
                  type: 'group',
                  fields: [
                    {
                      name: 'eyebrow',
                      type: 'text',
                      defaultValue: 'Our Story',
                    },
                    {
                      name: 'heading',
                      type: 'text',
                      defaultValue: 'A Workshop, Not a Factory',
                    },
                    mediaRelationship('image', 'About Image'),
                    {
                      name: 'paragraphs',
                      type: 'array',
                      labels: {
                        singular: 'Paragraph',
                        plural: 'Paragraphs',
                      },
                      fields: [
                        {
                          name: 'text',
                          type: 'textarea',
                          required: true,
                        },
                      ],
                    },
                    {
                      name: 'stats',
                      type: 'array',
                      labels: {
                        singular: 'Stat',
                        plural: 'Stats',
                      },
                      fields: [
                        {
                          name: 'value',
                          type: 'number',
                          required: true,
                        },
                        {
                          name: 'suffix',
                          type: 'text',
                        },
                        {
                          name: 'label',
                          type: 'text',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'process',
                  type: 'group',
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'steps',
                      type: 'array',
                      labels: {
                        singular: 'Step',
                        plural: 'Steps',
                      },
                      fields: [
                        {
                          name: 'number',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'body',
                          type: 'textarea',
                          required: true,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'contact',
                  type: 'group',
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'workingHours',
                      type: 'textarea',
                      defaultValue: 'Monday - Saturday\n9:00 AM - 7:00 PM\nSunday: By Appointment',
                    },
                    {
                      name: 'mapEmbedUrl',
                      type: 'text',
                      admin: {
                        description:
                          'Optional Google Maps embed URL for the contact map area.',
                      },
                    },
                  ],
                },
                {
                  name: 'previousWork',
                  type: 'group',
                  admin: {
                    description:
                      'Showcase completed projects and past work on the website.',
                  },
                  fields: [
                    ...sectionHeadingFields,
                    {
                      name: 'items',
                      type: 'array',
                      labels: {
                        singular: 'Project',
                        plural: 'Projects',
                      },
                      admin: {
                        description:
                          'Add, remove, reorder, or edit previous work items here.',
                      },
                      fields: [
                        mediaRelationship('image', 'Project Image'),
                        {
                          name: 'title',
                          type: 'text',
                          required: true,
                        },
                        {
                          name: 'category',
                          type: 'select',
                          options: [
                            { label: 'Bedroom', value: 'bedroom' },
                            { label: 'Living Room', value: 'living-room' },
                            { label: 'Dining', value: 'dining' },
                            { label: 'Office', value: 'office' },
                            { label: 'Outdoor', value: 'outdoor' },
                            { label: 'Custom', value: 'custom' },
                          ],
                        },
                        {
                          name: 'location',
                          type: 'text',
                          admin: {
                            description: 'City or area where this project was delivered.',
                          },
                        },
                        {
                          name: 'year',
                          type: 'text',
                          admin: {
                            description: 'Year of completion, e.g. 2025.',
                          },
                        },
                        {
                          name: 'description',
                          type: 'textarea',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Testimonials',
          fields: [
            {
              name: 'testimonialSection',
              type: 'group',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'What Clients Say',
                },
                {
                  name: 'heading',
                  type: 'text',
                  defaultValue: 'Real Homes, Real Stories',
                },
                {
                  name: 'items',
                  type: 'array',
                  labels: {
                    singular: 'Testimonial',
                    plural: 'Testimonials',
                  },
                  admin: {
                    description:
                      'Admins can add, remove, reorder, or edit homepage testimonials here.',
                  },
                  fields: testimonialFields,
                },
              ],
            },
          ],
        },

        {
          label: 'Contact',
          fields: [
            {
              name: 'whatsappNumber',
              type: 'text',
              required: true,
              defaultValue: process.env.WHATSAPP_NUMBER || '919876543210',
            },
            {
              name: 'displayPhone',
              type: 'text',
              required: true,
              defaultValue: process.env.DISPLAY_PHONE || '+91 98765 43210',
            },
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              defaultValue: process.env.CONTACT_EMAIL || 'hello@mdlhandicrafts.in',
            },
            {
              name: 'instagramUrl',
              type: 'text',
              required: true,
              defaultValue: process.env.INSTAGRAM_URL || 'https://instagram.com/mdl_handicrafts',
            },
            {
              name: 'instagramHandle',
              type: 'text',
              required: true,
              defaultValue: process.env.INSTAGRAM_HANDLE || '@mdl_handicrafts',
            },
            {
              name: 'workshopAddress',
              type: 'textarea',
              required: true,
              defaultValue: '[Full Address Line 1]\n[Jaipur, Rajasthan - pincode]',
            },
          ],
        },
        {
          label: 'Payments',
          fields: [
            {
              name: 'paymentSettings',
              type: 'group',
              fields: [
                {
                  name: 'acceptUpi',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'upiId',
                  type: 'text',
                  defaultValue: process.env.UPI_ID || 'payments@deeksha',
                },
                {
                  name: 'acceptBankTransfer',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'bankAccountName',
                  type: 'text',
                  defaultValue: process.env.BANK_ACCOUNT_NAME || 'Deeksha Handicrafts',
                },
                {
                  name: 'bankName',
                  type: 'text',
                  defaultValue: process.env.BANK_NAME || 'Your Bank Name',
                },
                {
                  name: 'bankAccountNumber',
                  type: 'text',
                  defaultValue: process.env.BANK_ACCOUNT_NUMBER || '1234567890',
                },
                {
                  name: 'bankIfsc',
                  type: 'text',
                  defaultValue: process.env.BANK_IFSC || 'BANK0001234',
                },
                {
                  name: 'acceptCashOnDelivery',
                  type: 'checkbox',
                  defaultValue: true,
                },
                {
                  name: 'paymentInstructions',
                  type: 'textarea',
                  defaultValue:
                    'Share your order reference after payment so we can confirm your build slot and delivery timeline.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
