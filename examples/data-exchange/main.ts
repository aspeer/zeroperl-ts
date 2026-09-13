import { ZeroPerl } from '@webdyne/webdyne-zeroperl-ts';

const perl = await ZeroPerl.create();
try {
    const loaded = await perl.eval(`
        use strict;
        use warnings;
        sub summarize {
            my ($order_hr)=@_;
            my $total=0;
            foreach my $item_hr (@{$order_hr->{'items'}}) {
                $total+=$item_hr->{'price'}*$item_hr->{'quantity'};
            }
            our %summary=(customer => $order_hr->{'customer'}, total => $total);
            return $total;
        }
        sub labels { return ('ready', 'paid') }
    `);
    if (!loaded.success) throw new Error(loaded.error);

    const order = perl.toPerlValue({
        customer: 'Alice',
        items: [{ price: 12, quantity: 2 }, { price: 6, quantity: 1 }],
    });
    try {
        const summary = await perl.call('summarize', [order], 'scalar');
        try {
            // call() can fulfill after a Perl exception; inspect $@ immediately.
            const error = perl.getLastError();
            if (error) throw new Error(error);
            if (!summary) throw new Error('Missing summary');
            console.log(`Total: ${summary.project()}`);
            const hash = perl.getHashVariable('summary');
            try {
                if (!hash) throw new Error('Missing summary hash');
                console.log(JSON.stringify(hash.project()));
            } finally {
                await hash?.dispose();
            }
        } finally {
            await summary?.dispose();
        }
        const labels = await perl.call('labels', [], 'list');
        try {
            const error = perl.getLastError();
            if (error) throw new Error(error);
            console.log(labels.map(value => value.toString()).join(', '));
        } finally {
            for (const value of labels) await value.dispose();
        }
    } finally {
        await order.dispose();
    }
} finally {
    await perl.dispose();
}
